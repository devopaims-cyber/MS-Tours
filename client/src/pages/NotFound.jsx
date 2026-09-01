import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCompass, FaHome, FaArrowLeft } from 'react-icons/fa';

import Button from '@/components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>404 — Off the map | MS Tours</title></Helmet>
      <div className="container-page py-20 text-center max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
        >
          <FaCompass className="text-8xl text-brand-violet mx-auto" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-fredoka text-6xl text-navy mt-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-navy/70 mt-2"
        >
          Looks like you took a wrong turn. The page you’re looking for has wandered off the map.
        </motion.p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Button variant="primary" leftIcon={<FaHome />} onClick={() => navigate('/')}>Go home</Button>
          <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    </>
  );
}
