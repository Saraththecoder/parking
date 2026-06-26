import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_SPACES, MOCK_BOOKINGS, MOCK_TRANSACTIONS, MOCK_REVIEWS } from '../data/mockData';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Users State
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); // Starts as Arjun Malhotra (Seeker)
  
  // Spaces State
  const [spaces, setSpaces] = useState(MOCK_SPACES);
  
  // Bookings State
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  
  // Transactions State
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  // Reviews State
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  // Helpers to switch active user/role for mock experience
  const switchUserRole = (role) => {
    const matchedUser = users.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      toast.success(`Switched role to ${role.toUpperCase()}: ${matchedUser.name}`);
    }
  };

  // Add a new vehicle to seeker's profile
  const addVehicle = (number, type, name) => {
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        const newVehicle = { id: `v-${Date.now()}`, number, type, name };
        const updatedUser = {
          ...user,
          vehicles: [...(user.vehicles || []), newVehicle]
        };
        // Update currentUser as well
        if (user.id === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);
    toast.success(`Vehicle ${number} added successfully!`);
  };

  // Saved addresses
  const addSavedAddress = (label, address) => {
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        const newAddr = { id: `a-${Date.now()}`, label, address };
        const updatedUser = {
          ...user,
          savedAddresses: [...(user.savedAddresses || []), newAddr]
        };
        if (user.id === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);
    toast.success(`Address '${label}' saved!`);
  };

  // Wallet - Add money
  const addMoneyToWallet = (amount) => {
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
        setCurrentUser(updatedUser);
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);

    // Record transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount,
      type: "deposit",
      description: "Added to wallet",
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      method: "UPI Payment"
    };
    setTransactions([newTx, ...transactions]);
    toast.success(`₹${amount} added to your wallet!`);
  };

  // Wallet - Withdraw money (Owner)
  const withdrawFunds = (amount) => {
    if (currentUser.walletBalance < amount) {
      toast.error("Insufficient balance for withdrawal!");
      return false;
    }

    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        const updatedUser = { ...user, walletBalance: user.walletBalance - amount };
        setCurrentUser(updatedUser);
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);

    // Record transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: -amount,
      type: "withdraw",
      description: "Withdrawn to Bank Account",
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      method: "IMPS Transfer"
    };
    setTransactions([newTx, ...transactions]);
    toast.success(`₹${amount} transferred to your bank account!`);
    return true;
  };

  // Add Parking Space (Owner)
  const addParkingSpace = (spaceData) => {
    const newSpace = {
      id: `space-${Date.now()}`,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostAvatar: currentUser.avatar,
      hostExperience: "New Host",
      rating: 5.0,
      reviewsCount: 0,
      isVerified: false,
      distance: "0.1km away",
      images: [
        spaceData.image || "https://images.unsplash.com/photo-1506521788701-1e13a4e83f2a?w=800&auto=format&fit=crop&q=80"
      ],
      lat: Math.floor(Math.random() * 80) + 10,
      lng: Math.floor(Math.random() * 80) + 10,
      ...spaceData
    };
    setSpaces([...spaces, newSpace]);
    toast.success("Parking space listed successfully! Awaiting verification.");
    return newSpace;
  };

  // Toggle Space Availability
  const toggleSpaceAvailability = (spaceId) => {
    setSpaces(spaces.map(s => {
      if (s.id === spaceId) {
        const updated = { ...s, isDisabled: !s.isDisabled };
        toast.success(updated.isDisabled ? "Space suspended temporarily" : "Space is now active!");
        return updated;
      }
      return s;
    }));
  };

  // Delete Space (Owner)
  const deleteParkingSpace = (spaceId) => {
    setSpaces(spaces.filter(s => s.id !== spaceId));
    toast.success("Parking space removed from listing.");
  };

  // Verify/Approve Space (Admin)
  const verifyParkingSpace = (spaceId, isVerify = true) => {
    setSpaces(spaces.map(s => {
      if (s.id === spaceId) {
        const updated = { ...s, isVerified: isVerify };
        toast.success(isVerify ? "Parking space approved!" : "Parking space rejected");
        return updated;
      }
      return s;
    }));
  };

  // Book a Parking Spot
  const createBooking = (bookingDetails) => {
    const { spaceId, startTime, endTime, date, durationHours, vehicleId, paymentMethod } = bookingDetails;
    const space = spaces.find(s => s.id === spaceId);
    
    if (!space) {
      toast.error("Parking space not found.");
      return null;
    }

    const vehicle = currentUser.vehicles.find(v => v.id === vehicleId) || currentUser.vehicles[0];

    const subtotal = space.price * durationHours;
    const serviceFee = 20.0;
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + serviceFee + tax;

    // Check if wallet payment has enough funds
    if (paymentMethod === "wallet" || paymentMethod === "Wallet Balance") {
      if (currentUser.walletBalance < totalAmount) {
        toast.error("Insufficient wallet balance! Please add funds.");
        return null;
      }
      
      // Deduct seeker funds
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          const updatedUser = { ...user, walletBalance: user.walletBalance - totalAmount };
          setCurrentUser(updatedUser);
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers);

      // Record transaction
      const newTx = {
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        amount: -totalAmount,
        type: "payment",
        description: `Booked spot: ${space.name}`,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        method: "Wallet Balance"
      };
      setTransactions([newTx, ...transactions]);
    } else {
      // Direct payment simulate
      toast.success("Payment authorized via mock gateway.");
    }

    // Add booking record
    const newBooking = {
      id: `book-${Math.floor(1000 + Math.random() * 9000)}`,
      spaceId,
      spaceName: space.name,
      spaceAddress: space.address,
      seekerId: currentUser.id,
      seekerName: currentUser.name,
      vehicleNumber: vehicle.number,
      vehicleType: vehicle.type,
      vehicleName: vehicle.name,
      slot: `Slot ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(10 + Math.random() * 20)}`,
      date,
      startTime,
      endTime,
      durationHours,
      subtotal,
      serviceFee,
      tax,
      totalAmount,
      status: space.isInstantBooking ? "Active" : "Pending",
      paymentMethod: paymentMethod || "Mock Credit Card",
      hostId: space.hostId,
      hostName: space.hostName,
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    toast.success(space.isInstantBooking ? "Booking confirmed instantly!" : "Booking requested! Awaiting host approval.");
    return newBooking;
  };

  // Owner - Approve Booking
  const approveBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: "Active" };
      }
      return b;
    });
    setBookings(updatedBookings);

    toast.success("Booking request approved!");
  };

  // Owner/Admin - Reject/Cancel Booking
  const cancelBooking = (bookingId, reason = "Cancelled by user") => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Refund if payment was wallet or credit card simulator
    const refundAmount = booking.totalAmount;
    
    // Credit seeker back
    const updatedUsers = users.map(user => {
      if (user.id === booking.seekerId) {
        const refundUser = { ...user, walletBalance: user.walletBalance + refundAmount };
        if (currentUser.id === booking.seekerId) {
          setCurrentUser(refundUser);
        }
        return refundUser;
      }
      return user;
    });
    setUsers(updatedUsers);

    // Record Refund transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      userId: booking.seekerId,
      amount: refundAmount,
      type: "deposit",
      description: `Refund: Book-${booking.id} (${reason})`,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      method: "Refund Credit"
    };
    setTransactions([newTx, ...transactions]);

    // Update booking status
    setBookings(bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: "Cancelled" };
      }
      return b;
    }));

    toast.error(`Booking ${bookingId} cancelled. Refund of ₹${refundAmount} credited.`);
  };

  // Owner - Complete booking & credit earnings
  const completeBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Calculate owner payout (booking subtotal - 10% platform fee)
    const ownerPayout = booking.subtotal * 0.90;

    const updatedUsers = users.map(user => {
      if (user.id === booking.hostId) {
        const payoutUser = { ...user, walletBalance: user.walletBalance + ownerPayout };
        if (currentUser.id === booking.hostId) {
          setCurrentUser(payoutUser);
        }
        return payoutUser;
      }
      return user;
    });
    setUsers(updatedUsers);

    // Record Payout transaction
    const newTx = {
      id: `tx-${Date.now()}`,
      userId: booking.hostId,
      amount: ownerPayout,
      type: "earnings",
      description: `Earnings: Book-${booking.id}`,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      method: "Direct Credit"
    };
    setTransactions([newTx, ...transactions]);

    // Update booking status
    setBookings(bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: "Completed" };
      }
      return b;
    }));

    toast.success(`Booking completed! ₹${ownerPayout} credited to your earnings.`);
  };

  // Submit reviews
  const addReview = (spaceId, rating, content) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      spaceId,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      rating,
      date: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      content
    };
    
    // Update reviews list
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average rating of the space
    const spaceReviews = updatedReviews.filter(r => r.spaceId === spaceId);
    const avgRating = spaceReviews.reduce((sum, r) => sum + r.rating, 0) / spaceReviews.length;

    setSpaces(spaces.map(s => {
      if (s.id === spaceId) {
        return {
          ...s,
          rating: parseFloat(avgRating.toFixed(1)),
          reviewsCount: spaceReviews.length
        };
      }
      return s;
    }));

    toast.success("Review submitted!");
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        spaces,
        bookings,
        transactions,
        reviews,
        switchUserRole,
        addVehicle,
        addSavedAddress,
        addMoneyToWallet,
        withdrawFunds,
        addParkingSpace,
        toggleSpaceAvailability,
        deleteParkingSpace,
        verifyParkingSpace,
        createBooking,
        approveBooking,
        cancelBooking,
        completeBooking,
        addReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
