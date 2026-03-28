import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Input,
    Select,
    SelectItem,
    Button,
    Chip,
    Spinner,
    useDisclosure,
    addToast,
} from "@heroui/react";
import {
    Search,
    Trash2,
    FileText,
    Pencil,
    Mic,
    Waves,
    Container,
    Drum,
    Music4,
    RefreshCw,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import ConfirmDialog from "@components/ConfirmDialog";
import {
    fetchAllReports,
    deleteReportByType,
    type UnifiedReport,
    type PaginationInfo,
    type AllReportsParams,
} from "@services/apiCrud";

const reportTypes = [
    { key: "", label: "All Types" },
    { key: "analysis", label: "Meter Analysis" },
    { key: "acoustics", label: "Acoustics" },
    { key: "materials", label: "Materials" },
    { key: "instruments", label: "Instruments" },
    { key: "audio", label: "Audio Analysis" },
];

const typeIcons: Record<string, React.ReactNode> = {
    analysis: <Mic size={16} />,
    acoustics: <Waves size={16} />,
    materials: <Container size={16} />,
    instruments: <Drum size={16} />,
    audio: <Music4 size={16} />,
};

const typeColors: Record<string, "primary" | "secondary" | "success" | "warning" | "danger"> = {
    analysis: "primary",
    acoustics: "secondary",
    materials: "danger",
    instruments: "success",
    audio: "warning",
};

// Types that don't support edit (audio and meter/analysis)
const noEditTypes = ["audio", "analysis"];

export const ReportsDataTable = () => {
    const navigate = useNavigate();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();

    // Data state
    const [reports, setReports] = useState<UnifiedReport[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<UnifiedReport | null>(null);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch reports
    const loadReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params: AllReportsParams = {
                page: pagination.page,
                limit: pagination.limit,
                sortBy,
                sortOrder,
            };

            if (debouncedSearch) params.search = debouncedSearch;
            if (typeFilter) params.type = typeFilter;

            const response = await fetchAllReports(params);
            setReports(response.reports);
            setPagination(response.pagination);
        } catch (err) {
            setError("Failed to load reports. Please try again.");
            console.error("Error loading reports:", err);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, typeFilter, sortBy, sortOrder]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.page !== 1) {
            setPagination((prev) => ({ ...prev, page: 1 }));
        }
    }, [debouncedSearch, typeFilter]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    // Handle sort
    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    };

    // Handle delete
    const handleDeleteClick = (report: UnifiedReport) => {
        setDeleteTarget(report);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await deleteReportByType(deleteTarget.type, deleteTarget.id);
            addToast({
                title: "Report deleted",
                description: `"${deleteTarget.name}" has been deleted.`,
                color: "success",
            });
            setDeleteTarget(null);
            loadReports();
        } catch (err) {
            addToast({
                title: "Delete failed",
                description: "Failed to delete the report. Please try again.",
                color: "danger",
            });
            console.error("Error deleting report:", err);
        }
    };

    // Handle view detail
    const handleViewDetail = (report: UnifiedReport) => {
        navigate(report.detailUrl);
    };

    // Handle edit - navigate to feature page with edit mode
    const handleEdit = (report: UnifiedReport) => {
        // Navigate to the feature's main page where edit can be triggered
        const editUrls: Record<string, string> = {
            acoustics: `/acoustics?edit=${report.id}`,
            materials: `/materials?edit=${report.id}`,
            instruments: `/instruments?edit=${report.id}`,
        };
        const url = editUrls[report.type] || report.detailUrl;
        navigate(url);
    };

    // Format date
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Render sort icon
    const renderSortIcon = (column: string) => {
        if (sortBy !== column) return null;
        return sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    // Check if edit is allowed for this report type
    const canEdit = (type: string): boolean => {
        return !noEditTypes.includes(type);
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    startContent={<Search size={18} className="text-default-400" />}
                    className="sm:max-w-xs"
                    isClearable
                    onClear={() => setSearchQuery("")}
                />

                <Select
                    placeholder="Filter by type"
                    selectedKeys={typeFilter ? [typeFilter] : []}
                    onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setTypeFilter(selected || "");
                    }}
                    className="sm:max-w-xs"
                >
                    {reportTypes.map((type) => (
                        <SelectItem key={type.key}>{type.label}</SelectItem>
                    ))}
                </Select>

                <Button
                    variant="flat"
                    startContent={<RefreshCw size={16} />}
                    onPress={loadReports}
                    isLoading={isLoading}
                >
                    Refresh
                </Button>
            </div>

            {/* Error state */}
            {error && (
                <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg text-danger">
                    {error}
                </div>
            )}

            {/* Table */}
            <Table
                aria-label="Reports table"
                removeWrapper
                bottomContent={
                    pagination.totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination
                                total={pagination.totalPages}
                                page={pagination.page}
                                onChange={handlePageChange}
                                showControls
                            />
                        </div>
                    )
                }
            >
                <TableHeader>
                    <TableColumn>
                        <button
                            className="flex items-center gap-1 font-semibold cursor-pointer hover:text-primary"
                            onClick={() => handleSort("name")}
                        >
                            Name {renderSortIcon("name")}
                        </button>
                    </TableColumn>
                    <TableColumn>
                        <button
                            className="flex items-center gap-1 font-semibold cursor-pointer hover:text-primary"
                            onClick={() => handleSort("type")}
                        >
                            Type {renderSortIcon("type")}
                        </button>
                    </TableColumn>
                    <TableColumn>
                        <button
                            className="flex items-center gap-1 font-semibold cursor-pointer hover:text-primary"
                            onClick={() => handleSort("createdAt")}
                        >
                            Date {renderSortIcon("createdAt")}
                        </button>
                    </TableColumn>
                    <TableColumn className="text-center">Actions</TableColumn>
                </TableHeader>
                <TableBody
                    items={reports}
                    isLoading={isLoading}
                    loadingContent={<Spinner label="Loading reports..." />}
                    emptyContent={
                        <div className="py-10 text-center text-default-500">
                            {debouncedSearch || typeFilter
                                ? "No reports match your filters."
                                : "No reports found. Start creating reports in the features."}
                        </div>
                    }
                >
                    {(report) => (
                        <TableRow key={`${report.type}-${report.id}`}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{report.name}</span>
                                    <span className="text-xs text-default-400">{report.id}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={typeColors[report.type]}
                                    variant="flat"
                                    size="sm"
                                    startContent={typeIcons[report.type]}
                                >
                                    {report.typeLabel}
                                </Chip>
                            </TableCell>
                            <TableCell>{formatDate(report.createdAt || report.date)}</TableCell>
                            <TableCell>
                                <div className="flex gap-1 justify-center">
                                    <Button
                                        color="primary"
                                        variant="light"
                                        size="sm"
                                        isIconOnly
                                        onPress={() => handleViewDetail(report)}
                                        title="View Report"
                                    >
                                        <FileText size={16} />
                                    </Button>
                                    {canEdit(report.type) && (
                                        <Button
                                            color="secondary"
                                            variant="light"
                                            size="sm"
                                            isIconOnly
                                            onPress={() => handleEdit(report)}
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                    )}
                                    <Button
                                        color="danger"
                                        variant="light"
                                        size="sm"
                                        isIconOnly
                                        onPress={() => handleDeleteClick(report)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination info */}
            {pagination.total > 0 && (
                <div className="text-sm text-default-500 text-center">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reports
                </div>
            )}

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                title="Confirm Delete"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default ReportsDataTable;
