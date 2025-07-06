async function main() {
  await import('./seed-sellers');
  await import('./seed-stores');
  await import('./seed-buyers');
  await import('./seed-clothing');
  await import('./seed-bids');
}

main();
