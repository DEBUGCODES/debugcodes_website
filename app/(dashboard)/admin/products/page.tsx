"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  MoreHorizontal,
  Zap,
  Layers,
  DollarSign,
  Globe,
  Package,
  X,
  Check,
  AlertCircle,
  Tag,
  BarChart3,
  Lightbulb,
  Server,
  Code,
  Filter,
  ArrowUpDown,
  Briefcase, // Reusing briefcase as a generic page icon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Assuming standard Shadcn utils

// --- Product Types ---
interface Product {
  id: number;
  name: string;
  category: "Platform" | "API" | "Consulting" | "Managed Service";
  description: string;
  priceModel: "Subscription" | "One-time" | "Quote";
  price: number;
  status: "Live" | "Beta" | "Deprecated";
  isFeatured: boolean;
}

type ViewMode = "grid" | "list";

// --- Constants & Helpers ---

const STATUS_STYLES = {
  Live: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: Globe,
  },
  Beta: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: AlertCircle,
  },
  Deprecated: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: X,
  },
};

const getCategoryDetails = (category: Product["category"]) => {
  switch (category) {
    case "Platform":
      return {
        icon: Package,
        color: "text-teal-600 bg-teal-50",
        stripe: "bg-teal-600",
      };
    case "API":
      return {
        icon: Code,
        color: "text-sky-600 bg-sky-50",
        stripe: "bg-sky-600",
      };
    case "Consulting":
      return {
        icon: Lightbulb,
        color: "text-amber-600 bg-amber-50",
        stripe: "bg-amber-600",
      };
    case "Managed Service":
      return {
        icon: Server,
        color: "text-green-600 bg-green-50",
        stripe: "bg-green-600",
      };
  }
};

const newProductTemplate: Product = {
  id: 0,
  name: "",
  category: "Platform",
  description: "",
  priceModel: "Subscription",
  price: 0.0,
  status: "Beta",
  isFeatured: false,
};

// --- Mock Data ---
const initialProducts: Product[] = [
  {
    id: 201,
    name: "DataFlow Engine",
    category: "Platform",
    description:
      "A scalable, real-time data ingestion and processing platform for enterprise data.",
    priceModel: "Subscription",
    price: 499.99,
    status: "Live",
    isFeatured: true,
  },
  {
    id: 202,
    name: "GeoLocation API",
    category: "API",
    description:
      "High-speed, low-latency API for reverse geocoding and mapping services.",
    priceModel: "Subscription",
    price: 19.99,
    status: "Live",
    isFeatured: false,
  },
  {
    id: 203,
    name: "Cloud Strategy Audit",
    category: "Consulting",
    description:
      "A three-day comprehensive assessment of your current cloud infrastructure and costs.",
    priceModel: "One-time",
    price: 4500.0,
    status: "Live",
    isFeatured: true,
  },
  {
    id: 204,
    name: "Managed Kubernetes Service",
    category: "Managed Service",
    description:
      "Fully managed, highly available K8s clusters with 24/7 proactive support and monitoring.",
    priceModel: "Quote",
    price: 0,
    status: "Beta",
    isFeatured: false,
  },
  {
    id: 205,
    name: "Legacy System Wrapper",
    category: "API",
    description:
      "Tool to securely expose legacy data through modern REST endpoints for easy integration.",
    priceModel: "Subscription",
    price: 99.0,
    status: "Deprecated",
    isFeatured: false,
  },
  {
    id: 206,
    name: "AI Insight Module",
    category: "Platform",
    description:
      "Generative AI module for data analysis and predictive modeling.",
    priceModel: "Subscription",
    price: 799.0,
    status: "Beta",
    isFeatured: false,
  },
];

const formatPrice = (model: Product["priceModel"], price: number): string => {
  if (model === "Quote" || price === 0) return "Quote Required";
  if (model === "Subscription") return `$${price.toFixed(2)} / mo`;
  return `$${price.toFixed(2)} (One-Time)`;
};

export default function ProductsPage() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true); // Splash Screen
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Modal/Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false); // For Create/Edit
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // For Delete
  const [currentProduct, setCurrentProduct] =
    useState<Product>(newProductTemplate);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isSaving, setIsSaving] = useState(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // --- Effects ---

  // Simulate Initial App Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(initialProducts);
      setInitialLoading(false);
    }, 2000); // 2 second splash screen
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setMode("create");
    setCurrentProduct(newProductTemplate);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setMode("edit");
    setCurrentProduct({ ...product }); // Clone to avoid direct mutation
    setIsSheetOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentProduct.name || !currentProduct.category) {
      // Add better validation/toast
      alert("Product Name and Category are required.");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API

    const priceToSave =
      currentProduct.priceModel === "Quote" ? 0 : currentProduct.price;

    if (mode === "create") {
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      setProducts((prev) => [
        ...prev,
        { ...currentProduct, id: newId, price: priceToSave },
      ]);
    } else {
      setProducts(
        products.map((p) =>
          p.id === currentProduct.id
            ? { ...currentProduct, price: priceToSave }
            : p
        )
      );
    }

    setIsSaving(false);
    setIsSheetOpen(false);
  };

  const handleDelete = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProducts(products.filter((p) => p.id !== currentProduct.id));
    setIsSaving(false);
    setIsDeleteDialogOpen(false);
  };

  // --- Computed ---

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // --- Render Components ---

  // 1. Initial Splash Screen
  if (initialLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-24 h-24 mb-6 animate-bounce-slow">
          {/* Replace with your actual logo image source */}
          <div className="w-24 h-24 rounded-2xl bg-teal-600 flex items-center justify-center drop-shadow-xl">
            <Package className="w-12 h-12 text-white" />
          </div>
          {/* A pulsing ripple effect behind the logo */}
          <div className="absolute inset-0 bg-teal-500/20 rounded-2xl animate-ping -z-10" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-gray-800 animate-pulse">
            Loading Product Catalog
          </h2>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-75" />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8 font-sans">
      {/* 2. Top Header & Controls (Teal Theme) */}
      <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Package className="w-5 h-5 text-teal-700" />
            </div>
            <span className="text-sm font-bold text-teal-700 uppercase tracking-wider">
              Catalog
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Products & Services
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Manage your customer-facing offerings, from platforms to APIs and
            consulting.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white p-1 rounded-lg border shadow-sm flex items-center">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <ListIcon className="w-4 h-4 mr-2" /> List
            </Button>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 h-11 px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Button>
        </div>
      </div>

      {/* 3. Search & Filters Bar (Sticky) */}
      <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm sticky top-2 z-30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-teal-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] border-gray-200 bg-gray-50">
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Platform">Platform</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
                <SelectItem value="Managed Service">Managed Service</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] border-gray-200 bg-gray-50">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Beta">Beta</SelectItem>
                <SelectItem value="Deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 4. Main Content Area */}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-gray-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium w-[40%]">
                    Product Name
                  </th>
                  <th className="px-6 py-4 font-medium w-[15%]">Category</th>
                  <th className="px-6 py-4 font-medium w-[15%]">Status</th>
                  <th className="px-6 py-4 font-medium w-[20%]">Pricing</th>
                  <th className="px-6 py-4 font-medium w-[10%] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => {
                  const CategoryIcon = getCategoryDetails(
                    product.category
                  ).icon;
                  const { color, bg } = STATUS_STYLES[product.status];

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 group transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${getCategoryDetails(product.category).color}`}
                          >
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {product.name}
                              {product.isFeatured && (
                                <Zap className="h-4 w-4 text-amber-500 fill-amber-500/50" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[300px]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`${bg} ${color} border-0`}
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {formatPrice(product.priceModel, product.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ProductActions
                          product={product}
                          onEdit={handleOpenEdit}
                          onDelete={handleOpenDelete}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <EmptyState />}
          </div>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const StatusIcon = STATUS_STYLES[product.status].icon;
            const CategoryIcon = getCategoryDetails(product.category).icon;
            const stripeColor = getCategoryDetails(product.category).stripe;

            return (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden relative"
              >
                {/* Category Color Strip Indicator */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${stripeColor}`}
                />

                <CardHeader className="pb-3 pt-5 pl-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${STATUS_STYLES[product.status].bg} ${STATUS_STYLES[product.status].color} ${STATUS_STYLES[product.status].border} mb-2`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {product.status}
                      </Badge>
                      {product.isFeatured && (
                        <Zap className="h-4 w-4 text-amber-500 fill-amber-500/50" />
                      )}
                    </div>
                    <ProductActions
                      product={product}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                    />
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-teal-700 transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-6 pb-3">
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`p-1.5 rounded-full ${getCategoryDetails(product.category).color}`}
                    >
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 uppercase">
                      {product.category}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pl-6 border-t bg-gray-50/30 py-3 flex items-center justify-between text-sm text-gray-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    <span>
                      {formatPrice(product.priceModel, product.price)}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${STATUS_STYLES[product.status].bg} ${STATUS_STYLES[product.status].color}`}
                  >
                    {product.priceModel}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === "grid" && filteredProducts.length === 0 && <EmptyState />}

      {/* 5. Create/Edit Sheet (Side Drawer) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">
              {mode === "create" ? "Add New Product" : "Edit Product Details"}
            </SheetTitle>
            <SheetDescription>
              {mode === "create"
                ? "Define the core details, category, and pricing for your new offering."
                : `Updating configuration for: ${currentProduct.name}`}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                placeholder="e.g. Enterprise Data Platform"
                className="focus-visible:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea
                value={currentProduct.description}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
                placeholder="A brief, compelling summary of the product's function..."
                className="h-24 resize-none focus-visible:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={currentProduct.category}
                  onValueChange={(val: any) =>
                    setCurrentProduct({ ...currentProduct, category: val })
                  }
                >
                  <SelectTrigger className="focus-visible:ring-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platform">Platform</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Managed Service">
                      Managed Service
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Deployment Status</Label>
                <Select
                  value={currentProduct.status}
                  onValueChange={(val: any) =>
                    setCurrentProduct({ ...currentProduct, status: val })
                  }
                >
                  <SelectTrigger className="focus-visible:ring-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Beta">Beta (Testing)</SelectItem>
                    <SelectItem value="Deprecated">
                      Deprecated (Retired)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Pricing Model</Label>
                <Select
                  value={currentProduct.priceModel}
                  onValueChange={(val: any) =>
                    setCurrentProduct({
                      ...currentProduct,
                      priceModel: val,
                      price: val === "Quote" ? 0 : currentProduct.price,
                    })
                  }
                >
                  <SelectTrigger className="focus-visible:ring-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Subscription">
                      Subscription (Monthly)
                    </SelectItem>
                    <SelectItem value="One-time">One-time License</SelectItem>
                    <SelectItem value="Quote">Contact for Quote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    disabled={currentProduct.priceModel === "Quote"}
                    value={
                      currentProduct.priceModel === "Quote"
                        ? ""
                        : currentProduct.price.toFixed(2)
                    }
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="pl-7 focus-visible:ring-teal-500 disabled:opacity-60 disabled:bg-gray-100"
                    placeholder={
                      currentProduct.priceModel === "Quote" ? "N/A" : "0.00"
                    }
                  />
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCurrentProduct({
                  ...currentProduct,
                  isFeatured: !currentProduct.isFeatured,
                })
              }
              className={`w-full justify-between h-10 transition-colors ${currentProduct.isFeatured ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="flex items-center gap-2">
                <Zap
                  className={`h-4 w-4 ${currentProduct.isFeatured ? "fill-amber-400" : ""}`}
                />
                Highlight as Featured Product
              </span>
              {currentProduct.isFeatured ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>

          <SheetFooter className="mt-8">
            <Button
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px] shadow-md hover:shadow-lg"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Saving...
                </>
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 6. Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{currentProduct.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              {isSaving ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Subcomponents ---

function ProductActions({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: any;
  onDelete: any;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(product)}>
          Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(product.name)}
        >
          Copy Name
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => onDelete(product)}
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No products found</h3>
      <p className="text-gray-500 max-w-sm mt-1 mb-4">
        We couldn't find any catalog items matching your filters. Try adjusting
        your search or create a new product.
      </p>
    </div>
  );
}
