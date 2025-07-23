import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <motion.header 
      className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sprout size={32} className="text-green-200" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">AgriPulse</h1>
              <p className="text-green-200 text-sm">AI Climate-Smart Farming</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-green-500 transition-colors"
            >
              <Bell size={20} />
            </motion.button>
            
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-green-200 text-sm">{user.location}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="p-2 rounded-full hover:bg-green-500 transition-colors"
                >
                  <LogOut size={20} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}