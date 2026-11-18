import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { PrismaService } from '../src/database/prisma/prisma.service';

interface RoleItem {
  id: string;
  code: string;
}

interface PermissionItem {
  id: string;
  code: string;
}

describe('Auth và RBAC (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const createdUserIds: string[] = [];
  const createdRoleIds: string[] = [];
  const suffix = Date.now().toString();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (prisma && createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    if (prisma && createdRoleIds.length > 0) {
      await prisma.role.deleteMany({ where: { id: { in: createdRoleIds } } });
    }
    if (app) {
      await app.close();
    }
  });

  function http() {
    return request(app.getHttpServer());
  }

  function bearer(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  async function login(email: string, password: string) {
    return http().post('/api/v1/auth/login').send({ email, password });
  }

  it('đăng nhập thành công và không trả mật khẩu', async () => {
    const response = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const serialized = JSON.stringify(response.body);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe(MESSAGES.LOGIN_SUCCESS);
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.body.data.refreshToken).toEqual(expect.any(String));
    expect(response.body.data.user.email).toBe(process.env.SEED_SUPER_ADMIN_EMAIL);
    expect(response.body.data.user.permissions).toContain('users.view');
    expect(serialized).not.toContain('passwordHash');
    expect(serialized).not.toContain(process.env.SEED_SUPER_ADMIN_PASSWORD);

    const stored = await prisma.refreshToken.findFirst({
      where: { user: { email: process.env.SEED_SUPER_ADMIN_EMAIL } },
      orderBy: { createdAt: 'desc' },
    });
    expect(stored?.tokenHash).not.toBe(response.body.data.refreshToken);
  });

  it('từ chối sai mật khẩu', async () => {
    const response = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      'WrongPass123',
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: 401,
      message: MESSAGES.INVALID_CREDENTIALS,
      data: null,
    });
  });

  it('từ chối token không hợp lệ', async () => {
    const response = await http()
      .get('/api/v1/auth/me')
      .set(bearer('not-a-jwt'));

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe(MESSAGES.UNAUTHORIZED);
  });

  it('khóa tài khoản thì không đăng nhập được', async () => {
    const admin = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const token = admin.body.data.accessToken as string;
    const roles = await http()
      .get('/api/v1/roles')
      .query({ limit: 20 })
      .set(bearer(token));
    const staffRole = (roles.body.data.items as RoleItem[]).find(
      (item) => item.code === 'STAFF',
    );
    expect(staffRole).toBeDefined();

    const email = `e2e-${suffix}-locked@minhsam.local`;
    const password = 'StaffPass123';
    const created = await http()
      .post('/api/v1/users')
      .set(bearer(token))
      .send({
        email,
        password,
        fullName: 'Nhân viên khóa',
        roleId: staffRole?.id,
      });
    expect(created.status).toBe(201);
    createdUserIds.push(created.body.data.id as string);

    const locked = await http()
      .patch(`/api/v1/users/${created.body.data.id}/lock`)
      .set(bearer(token));
    expect(locked.status).toBe(200);

    const response = await login(email, password);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      code: 403,
      message: MESSAGES.ACCOUNT_LOCKED,
      data: null,
    });
  });

  it('user có permission thì xem được, user không có thì bị cấm', async () => {
    const admin = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const adminToken = admin.body.data.accessToken as string;
    const allowed = await http().get('/api/v1/users').set(bearer(adminToken));
    expect(allowed.status).toBe(200);
    expect(allowed.body.code).toBe(200);

    const roles = await http()
      .get('/api/v1/roles')
      .query({ limit: 20 })
      .set(bearer(adminToken));
    const staffRole = (roles.body.data.items as RoleItem[]).find(
      (item) => item.code === 'STAFF',
    );
    const email = `e2e-${suffix}-staff@minhsam.local`;
    const password = 'StaffPass123';
    const created = await http()
      .post('/api/v1/users')
      .set(bearer(adminToken))
      .send({
        email,
        password,
        fullName: 'Nhân viên',
        roleId: staffRole?.id,
      });
    createdUserIds.push(created.body.data.id as string);
    const staff = await login(email, password);

    const denied = await http()
      .get('/api/v1/users')
      .set(bearer(staff.body.data.accessToken as string));
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe(403);
    expect(denied.body.message).toBe(MESSAGES.FORBIDDEN);
  });

  it('role không có permission bị cấm, sau khi gán permission thì được phép', async () => {
    const admin = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const adminToken = admin.body.data.accessToken as string;
    const createdRole = await http()
      .post('/api/v1/roles')
      .set(bearer(adminToken))
      .send({
        code: `E2E_EMPTY_${suffix}`,
        name: 'Role trống',
        permissionIds: [],
      });
    expect(createdRole.status).toBe(201);
    const roleId = createdRole.body.data.id as string;
    createdRoleIds.push(roleId);

    const email = `e2e-${suffix}-empty@minhsam.local`;
    const password = 'EmptyPass123';
    const createdUser = await http()
      .post('/api/v1/users')
      .set(bearer(adminToken))
      .send({
        email,
        password,
        fullName: 'User trống quyền',
        roleId,
      });
    createdUserIds.push(createdUser.body.data.id as string);
    const session = await login(email, password);
    const userToken = session.body.data.accessToken as string;

    const denied = await http().get('/api/v1/roles').set(bearer(userToken));
    expect(denied.status).toBe(403);

    const permissions = await http()
      .get('/api/v1/permissions')
      .set(bearer(adminToken));
    const rolesView = (permissions.body.data as PermissionItem[]).find(
      (item) => item.code === 'roles.view',
    );
    const updated = await http()
      .patch(`/api/v1/roles/${roleId}/permissions`)
      .set(bearer(adminToken))
      .send({ permissionIds: [rolesView?.id] });
    expect(updated.status).toBe(200);

    const allowed = await http().get('/api/v1/roles').set(bearer(userToken));
    expect(allowed.status).toBe(200);
    expect(allowed.body.code).toBe(200);
  });

  it('không cho user tự nâng quyền', async () => {
    const admin = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const adminToken = admin.body.data.accessToken as string;
    const permissions = await http()
      .get('/api/v1/permissions')
      .set(bearer(adminToken));
    const catalog = permissions.body.data as PermissionItem[];
    const rolesView = catalog.find((item) => item.code === 'roles.view');
    const rolesUpdate = catalog.find((item) => item.code === 'roles.update');
    const usersUpdate = catalog.find((item) => item.code === 'users.update');
    const usersDelete = catalog.find((item) => item.code === 'users.delete');
    const roles = await http()
      .get('/api/v1/roles')
      .query({ limit: 20 })
      .set(bearer(adminToken));
    const superRole = (roles.body.data.items as RoleItem[]).find(
      (item) => item.code === 'SUPER_ADMIN',
    );

    const limited = await http()
      .post('/api/v1/roles')
      .set(bearer(adminToken))
      .send({
        code: `E2E_LIMITED_${suffix}`,
        name: 'Role giới hạn',
        permissionIds: [rolesView?.id, rolesUpdate?.id, usersUpdate?.id],
      });
    createdRoleIds.push(limited.body.data.id as string);
    const target = await http()
      .post('/api/v1/roles')
      .set(bearer(adminToken))
      .send({
        code: `E2E_TARGET_${suffix}`,
        name: 'Role đích',
        permissionIds: [],
      });
    createdRoleIds.push(target.body.data.id as string);

    const email = `e2e-${suffix}-limited@minhsam.local`;
    const password = 'LimitedPass1';
    const createdUser = await http()
      .post('/api/v1/users')
      .set(bearer(adminToken))
      .send({
        email,
        password,
        fullName: 'User giới hạn',
        roleId: limited.body.data.id,
      });
    createdUserIds.push(createdUser.body.data.id as string);
    const session = await login(email, password);
    const token = session.body.data.accessToken as string;

    const escalate = await http()
      .patch(`/api/v1/roles/${target.body.data.id}/permissions`)
      .set(bearer(token))
      .send({ permissionIds: [usersDelete?.id] });
    expect(escalate.status).toBe(403);
    expect(escalate.body.message).toBe(MESSAGES.PRIVILEGE_ESCALATION);

    const assignSuper = await http()
      .patch(`/api/v1/users/${createdUser.body.data.id}/role`)
      .set(bearer(token))
      .send({ roleId: superRole?.id });
    expect(assignSuper.status).toBe(403);
    expect(assignSuper.body.message).toBe(MESSAGES.SUPER_ADMIN_PROTECTED);
  });

  it('không sửa, xóa role hệ thống hoặc xóa role đang dùng', async () => {
    const admin = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const token = admin.body.data.accessToken as string;
    const roles = await http()
      .get('/api/v1/roles')
      .query({ limit: 20 })
      .set(bearer(token));
    const superRole = (roles.body.data.items as RoleItem[]).find(
      (item) => item.code === 'SUPER_ADMIN',
    );

    const patched = await http()
      .patch(`/api/v1/roles/${superRole?.id}`)
      .set(bearer(token))
      .send({ name: 'Đổi tên' });
    expect(patched.status).toBe(403);
    expect(patched.body.message).toBe(MESSAGES.SYSTEM_ROLE_PROTECTED);

    const removed = await http()
      .delete(`/api/v1/roles/${superRole?.id}`)
      .set(bearer(token));
    expect(removed.status).toBe(403);

    const me = await http().get('/api/v1/auth/me').set(bearer(token));
    const deletedAdmin = await http()
      .delete(`/api/v1/users/${me.body.data.id}`)
      .set(bearer(token));
    expect(deletedAdmin.status).toBe(403);

    const custom = await http()
      .post('/api/v1/roles')
      .set(bearer(token))
      .send({ code: `E2E_USED_${suffix}`, name: 'Role đang dùng' });
    createdRoleIds.push(custom.body.data.id as string);
    const user = await http()
      .post('/api/v1/users')
      .set(bearer(token))
      .send({
        email: `e2e-${suffix}-used@minhsam.local`,
        password: 'UsedPass123',
        fullName: 'User đang dùng role',
        roleId: custom.body.data.id,
      });
    createdUserIds.push(user.body.data.id as string);
    const blocked = await http()
      .delete(`/api/v1/roles/${custom.body.data.id}`)
      .set(bearer(token));
    expect(blocked.status).toBe(409);
    expect(blocked.body.message).toBe(MESSAGES.ROLE_IN_USE);
  });

  it('xoay vòng refresh token và đăng xuất thu hồi token', async () => {
    const first = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const refreshToken = first.body.data.refreshToken as string;
    const rotated = await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });
    expect(rotated.status).toBe(200);
    expect(rotated.body.data.refreshToken).not.toBe(refreshToken);

    const reused = await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });
    expect(reused.status).toBe(401);

    const afterReuse = await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: rotated.body.data.refreshToken });
    expect(afterReuse.status).toBe(401);

    const next = await login(
      process.env.SEED_SUPER_ADMIN_EMAIL ?? '',
      process.env.SEED_SUPER_ADMIN_PASSWORD ?? '',
    );
    const logout = await http()
      .post('/api/v1/auth/logout')
      .set(bearer(next.body.data.accessToken as string))
      .send({ refreshToken: next.body.data.refreshToken });
    expect(logout.status).toBe(200);
    expect(logout.body.data).toEqual({ revoked: true });

    const afterLogout = await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: next.body.data.refreshToken });
    expect(afterLogout.status).toBe(401);
  });
});
