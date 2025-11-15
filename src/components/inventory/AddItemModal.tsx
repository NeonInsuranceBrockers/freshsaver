// /src/components/inventory/AddItemModal.tsx

"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddItemForm from "./AddItemForm";

// Define the props for the modal
type AddItemModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function AddItemModal({
  isOpen,
  onOpenChange,
}: AddItemModalProps) {
  // This is the callback function we pass to the form.
  // When the form is successfully submitted, it will call this,
  // which then calls onOpenChange(false) to close the dialog.
  const handleFormSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill out the details below to add a new item to your inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddItemForm onFormSuccess={handleFormSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
