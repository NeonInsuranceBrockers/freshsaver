// /src/components/inventory/AddItemForm.tsx

"use client";

import React, { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { addInventoryItemAction } from "@/lib/actions/inventory.actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// This is a separate component for the submit button to manage its pending state.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
        </>
      ) : (
        "Add Item"
      )}
    </Button>
  );
}

// Main form component
export default function AddItemForm({
  onFormSuccess,
}: {
  onFormSuccess: () => void;
}) {
  const initialState = { success: false, message: "", errors: undefined };
  const [state, formAction] = useFormState(
    addInventoryItemAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onFormSuccess(); // Call the callback to close the modal
    } else if (state.message && !state.errors) {
      // Handle server/database errors that aren't validation-related
      toast.error(state.message);
    }
  }, [state, onFormSuccess]);

  // Static options for our dropdowns
  const categories = [
    "Produce",
    "Meat",
    "Dairy",
    "Grains",
    "Canned Goods",
    "Other",
  ];
  const locations = ["Fridge", "Pantry", "Freezer"];
  const units = ["g", "kg", "ml", "L", "unit", "can", "tbsp", "cup"];

  return (
    <form action={formAction} className="space-y-4">
      {/* Name Field */}
      <div>
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" name="name" placeholder="e.g., Tomato Sauce" />
        {state.errors?.name && (
          <p className="text-sm font-medium text-destructive mt-1">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Field */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category">
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.category && (
            <p className="text-sm font-medium text-destructive mt-1">
              {state.errors.category[0]}
            </p>
          )}
        </div>
        {/* Location Field */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Select name="location">
            <SelectTrigger id="location">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.location && (
            <p className="text-sm font-medium text-destructive mt-1">
              {state.errors.location[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quantity Field */}
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.1"
            placeholder="e.g., 400"
          />
          {state.errors?.quantity && (
            <p className="text-sm font-medium text-destructive mt-1">
              {state.errors.quantity[0]}
            </p>
          )}
        </div>
        {/* Unit Field */}
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select name="unit">
            <SelectTrigger id="unit">
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.unit && (
            <p className="text-sm font-medium text-destructive mt-1">
              {state.errors.unit[0]}
            </p>
          )}
        </div>
      </div>

      {/* Expiration Date Field */}
      <div>
        <Label htmlFor="expiration_date">Expiration Date</Label>
        <Input id="expiration_date" name="expiration_date" type="date" />
        {state.errors?.expiration_date && (
          <p className="text-sm font-medium text-destructive mt-1">
            {state.errors.expiration_date[0]}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
