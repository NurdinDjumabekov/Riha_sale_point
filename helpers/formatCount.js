export const formatCount = (count) => {
  return count % 1 === 0 ? count?.toFixed(0) : count?.toFixed(1);
};

/// если статое больше 0, то укпугля. до 1го числа, а если его не т то выводится просто целое число без 0
