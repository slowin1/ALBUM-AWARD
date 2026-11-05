#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const target = process.argv[2]?.trim();
  const role = process.argv[3]?.trim().toLowerCase() || 'admin';

  if (!target) {
    console.log('Использование: npm run set-admin <email-или-никнейм> [admin|user]');
    console.log('\nТекущие пользователи:');
    const users = await prisma.user.findMany({
      select: { id: true, nickname: true, email: true, role: true, provider: true },
      take: 20,
    });
    if (users.length === 0) {
      console.log('  (пользователей пока нет)');
    } else {
      console.table(users);
    }
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: target.toLowerCase() },
        { nickname: { equals: target, mode: 'insensitive' } },
      ],
    },
  });

  if (!user) {
    console.error(`❌ Пользователь "${target}" не найден в базе данных.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role },
  });

  console.log(`✅ Пользователю "${updated.nickname}" (${updated.email}) успешно установлена роль "${updated.role}"!`);
}

main()
  .catch(e => {
    console.error('Ошибка:', e.message || e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
