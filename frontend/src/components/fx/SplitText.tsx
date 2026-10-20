import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  type?: 'words' | 'chars';
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = '',
  delay = 0,
  type = 'words',
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'chars' ? 0.025 : 0.08,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 35,
      rotateX: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 140,
      },
    },
  };

  if (type === 'chars') {
    const chars = children.split('');
    return (
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`inline-block overflow-hidden ${className}`}
        style={{ perspective: 1000 }}
      >
        {chars.map((char, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  const words = children.split(' ');
  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
      style={{ perspective: 1000 }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span variants={itemVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};
