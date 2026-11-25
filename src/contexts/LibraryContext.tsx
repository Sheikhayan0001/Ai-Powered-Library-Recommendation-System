import React, { createContext, useContext, useEffect, useState } from 'react';
import { Book } from '../types';

interface LibraryContextType {
  selectedBooks: Book[];
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  isSelected: (bookId: string) => boolean;
  selectedCount: number;
}

const LibraryContext = createContext<LibraryContextType>({
  selectedBooks: [],
  addBook: () => {},
  removeBook: () => {},
  isSelected: () => false,
  selectedCount: 0,
});

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('lpu-selected-books');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lpu-selected-books', JSON.stringify(selectedBooks));
  }, [selectedBooks]);

  const addBook = (book: Book) => {
    setSelectedBooks(prev => {
      if (prev.find(b => b.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeBook = (bookId: string) => {
    setSelectedBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const isSelected = (bookId: string) => {
    return selectedBooks.some(b => b.id === bookId);
  };

  return (
    <LibraryContext.Provider
      value={{
        selectedBooks,
        addBook,
        removeBook,
        isSelected,
        selectedCount: selectedBooks.length,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
