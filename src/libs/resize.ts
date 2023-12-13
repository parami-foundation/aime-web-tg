export function resizeRef(func: any) {
  return new Promise((resolve, reject) => {
    const observer = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
      entries.forEach((entry) => {
        func(entry);
      });
    });
    resolve(observer);
  });
}