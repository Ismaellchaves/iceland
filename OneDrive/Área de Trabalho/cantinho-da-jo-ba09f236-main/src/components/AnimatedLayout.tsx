
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedLayoutProps {
  children: ReactNode;
}

export const pageVariants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 }
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedLayout;
