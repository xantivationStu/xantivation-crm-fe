export const backdropVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  open: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

export const containerVariants = {
  closed: {
    x: "115%",
    rotate: 6,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 30,
      staggerChildren: 0.06,
      staggerDirection: -1
    }
  },
  open: {
    x: 0,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 24,
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export const cardVariants = {
  closed: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: { duration: 0.2, ease: "easeIn" }
  },
  open: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 250, damping: 20 }
  }
};
