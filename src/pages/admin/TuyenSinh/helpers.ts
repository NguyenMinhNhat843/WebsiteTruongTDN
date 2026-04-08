export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

export const formatDate = (s: string) => {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

export const fillRate = (registered: number, quota: number) =>
  quota === 0 ? 0 : Math.round((registered / quota) * 100);
