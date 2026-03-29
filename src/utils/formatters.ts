export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const maskPhoneNumber = (phone: string): string => {
  if (phone.length < 4) return phone;
  const last4 = phone.slice(-4);
  return `+91 ****XX${last4}`;
};

export const maskAccountNumber = (acc: string): string => {
  return acc.replace(/\d(?=\d{4})/g, 'X');
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
