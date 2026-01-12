"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Box, Typography, Alert, Chip } from "@mui/material";
import {
  Add,
  Download,
  Upload,
  FilterList,
  Search,
  Description,
  Send,
  CheckCircle,
  Cancel,
  Schedule,
  Email,
  FileCopy
} from "@mui/icons-material";
import OfferLetterTable from "./OfferLetterTable";
import OfferLetterSummary from "./OfferLetterSummary";
import BulkSendModal from "./BulkSendModal";
import { createMockOfferLetters, IOfferLetter } from "./OfferLetterTypes";

const OfferLetterMainArea: React.FC = () => {
  const [offers, setOffers] = useState<IOfferLetter[]>([]);
  const [bulkSendModalOpen, setBulkSendModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  useEffect(() => {
    setOffers(createMockOfferLetters(8));
  }, []);

  const handleAddOffer = () => {
    window.location.href = "/owner/offers/add-offer";
  };

  const handleBulkSend = () => {
    setBulkSendModalOpen(true);
  };

  const handleExportOffers = () => {
    // Export functionality
    console.log("Exporting offers...");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.offerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || offer.offerStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">Offer Letters</li>
          </ol>
        </nav>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={handleBulkSend}
            size="small"
          >
            Bulk Send
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportOffers}
            size="small"
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddOffer}
            className="!text-white"
            size="small"
          >
            Create Offer
          </Button>
        </div>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            width: 56, 
            height: 56, 
            borderRadius: 2, 
            bgcolor: 'primary.light', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2
          }}>
            <Description sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Offer Letter Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, send, and track offer letters for candidates
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Summary Cards */}
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0 mb-6">
        <OfferLetterSummary offers={offers} />
      </div>

      {/* Search and Filter Bar */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        borderRadius: 1, 
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Search sx={{ mr: 1, color: 'text.secondary' }} />
          <input
            type="text"
            placeholder="Search offers by candidate name, email, position, or offer ID..."
            className="form-control border-0 bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={statusFilter === "All" ? "contained" : "outlined"}
            size="small"
            className="!text-white"
            onClick={() => handleStatusFilter("All")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "Sent" ? "contained" : "outlined"}
            size="small"
            color="info"
            onClick={() => handleStatusFilter("Sent")}
          >
            Sent
          </Button>
          <Button
            variant={statusFilter === "Accepted" ? "contained" : "outlined"}
            size="small"
            color="success"
            onClick={() => handleStatusFilter("Accepted")}
          >
            Accepted
          </Button>
          <Button
            variant={statusFilter === "Declined" ? "contained" : "outlined"}
            size="small"
            color="error"
            onClick={() => handleStatusFilter("Declined")}
          >
            Declined
          </Button>
        </Box>
      </Box>

      {/* Offer Letter Table */}
      <OfferLetterTable
        data={filteredOffers}
        onEdit={(offer) => {
          window.location.href = `/owner/offers/update-offer/${offer.id}`;
        }}
        onDelete={(id) => {
          setOffers(prev => prev.filter(offer => offer.id !== id));
        }}
        onSend={(id) => {
          setOffers(prev => prev.map(offer => 
            offer.id === id 
              ? { ...offer, offerStatus: 'Sent', sentDate: new Date().toISOString() } 
              : offer
          ));
        }}
        onStatusChange={(id, status) => {
          setOffers(prev => prev.map(offer => 
            offer.id === id 
              ? { ...offer, offerStatus: status as any, updatedAt: new Date().toISOString() } 
              : offer
          ));
        }}
      />

      {/* Info Alert */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Use templates for consistent offer letters. Track responses and set up automatic reminders.
        </Typography>
      </Alert>

      {/* Bulk Send Modal */}
      <BulkSendModal
        open={bulkSendModalOpen}
        offers={offers}
      />
    </div>
  );
};

export default OfferLetterMainArea;