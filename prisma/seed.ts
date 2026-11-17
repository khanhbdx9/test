import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/common/utils/password.util';
import { PrismaClient } from '../src/generated/prisma/client';

const ACTIONS: Record<string, string> = {
  view: 'Xem',
  create: 'Tạo',
  update: 'Cập nhật',
  delete: 'Xóa',
  cancel: 'Hủy',
  export: 'Xuất',
  manage: 'Quản lý',
  publish: 'Xuất bản',
};

const PERMISSIONS: ReadonlyArray<readonly [string, string]> = [
  ['users', 'view'],
  ['users', 'create'],
  ['users', 'update'],
  ['users', 'delete'],
  ['roles', 'view'],
  ['roles', 'create'],
  ['roles', 'update'],
  ['roles', 'delete'],
  ['products', 'view'],
  ['products', 'create'],
  ['products', 'update'],
  ['products', 'delete'],
  ['categories', 'view'],
  ['categories', 'create'],
  ['categories', 'update'],
  ['categories', 'delete'],
  ['orders', 'view'],
  ['orders', 'create'],
  ['orders', 'update'],
  ['orders', 'cancel'],
  ['reports', 'view'],
  ['reports', 'export'],
  ['banners', 'view'],
  ['banners', 'manage'],
  ['themes', 'view'],
  ['themes', 'manage'],
  ['posts', 'view'],
  ['posts', 'create'],
  ['posts', 'update'],
  ['posts', 'delete'],
  ['posts', 'publish'],
];

const ROLES = [
  {
    code: 'SUPER_ADMIN',
    name: 'Quản trị hệ thống',
    description: 'Tài khoản hệ thống được bảo vệ',
  },
  {
    code: 'ADMIN',
    name: 'Quản trị cửa hàng',
    description: 'Quản trị vận hành cửa hàng',
  },
  {
    code: 'MANAGER',
    name: 'Quản lý',
    description: 'Quản lý hoạt động kinh doanh',
  },
  {
    code: 'STAFF',
    name: 'Nhân viên',
    description: 'Xử lý đơn hàng',
  },
  {
    code: 'CONTENT_EDITOR',
    name: 'Biên tập nội dung',
    description: 'Quản lý nội dung website',
  },
] as const;

const ROLE_PERMISSIONS: Record<string, readonly string[] | '*'> = {
  SUPER_ADMIN: '*',
  ADMIN: '*',
  MANAGER: [
    'products.view',
    'products.create',
    'products.update',
    'products.delete',
    'categories.view',
    'categories.create',
    'categories.update',
    'categories.delete',
    'orders.view',
    'orders.create',
    'orders.update',
    'orders.cancel',
    'reports.view',
    'reports.export',
    'banners.view',
    'themes.view',
    'posts.view',
  ],
  STAFF: [
    'orders.view',
    'orders.create',
    'orders.update',
    'orders.cancel',
    'products.view',
    'categories.view',
  ],
  CONTENT_EDITOR: [
    'posts.view',
    'posts.create',
    'posts.update',
    'posts.delete',
    'posts.publish',
    'banners.view',
    'banners.manage',
    'themes.view',
    'themes.manage',
    'categories.view',
  ],
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main(): Promise<void> {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;
  const fullName = process.env.SEED_SUPER_ADMIN_NAME?.trim() || 'Super Admin';
  if (!email || !password) {
    throw new Error(
      'SEED_SUPER_ADMIN_EMAIL và SEED_SUPER_ADMIN_PASSWORD là bắt buộc',
    );
  }

  const permissionIds = new Map<string, string>();
  for (const [module, action] of PERMISSIONS) {
    const code = `${module}.${action}`;
    const permission = await prisma.permission.upsert({
      where: { code },
      update: {
        module,
        action,
        description: `${ACTIONS[action] ?? action} ${module}`,
      },
      create: {
        code,
        module,
        action,
        description: `${ACTIONS[action] ?? action} ${module}`,
      },
    });
    permissionIds.set(code, permission.id);
  }

  for (const role of ROLES) {
    const saved = await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
        isSystem: true,
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    });
    const granted = ROLE_PERMISSIONS[role.code];
    const codes = granted === '*' ? [...permissionIds.keys()] : [...(granted ?? [])];
    await prisma.rolePermission.deleteMany({ where: { roleId: saved.id } });
    await prisma.rolePermission.createMany({
      data: codes.map((code) => {
        const permissionId = permissionIds.get(code);
        if (!permissionId) {
          throw new Error(`Không tìm thấy permission ${code}`);
        }
        return { roleId: saved.id, permissionId };
      }),
    });
  }

  const superRole = await prisma.role.findUnique({
    where: { code: 'SUPER_ADMIN' },
  });
  if (!superRole) {
    throw new Error('Không tạo được role SUPER_ADMIN');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash: await hashPassword(password),
        roleId: superRole.id,
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
