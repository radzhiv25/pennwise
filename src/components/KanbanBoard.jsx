import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, PlayCircle, Edit, Trash2, GripVertical } from "lucide-react";

const statusConfig = {
    todo: {
        title: "To Do",
        description: "Pending transactions",
        color: "bg-yellow-100 border-yellow-300",
        icon: Clock,
        badgeColor: "bg-yellow-500"
    },
    "in-progress": {
        title: "In Progress",
        description: "Processing transactions",
        color: "bg-blue-100 border-blue-300",
        icon: PlayCircle,
        badgeColor: "bg-blue-500"
    },
    done: {
        title: "Done",
        description: "Completed transactions",
        color: "bg-green-100 border-green-300",
        icon: CheckCircle,
        badgeColor: "bg-green-500"
    }
};

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: transaction.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const statusInfo = statusConfig[transaction.status];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-2 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow ${transaction.type === 'income' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                }`}
        >
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        title="Drag to move between columns"
                    >
                        <GripVertical className="h-3 w-3 text-gray-400" />
                    </div>
                    <Badge className={`${statusInfo.badgeColor} text-white text-xs px-1 py-0`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                        {transaction.category}
                    </Badge>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(transaction);
                        }}
                        className="h-5 w-5 p-0"
                    >
                        <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(transaction);
                        }}
                        className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">
                        {transaction.currency === 'USD' ? '$' : transaction.currency === 'GBP' ? '£' : '₹'}{transaction.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                    </span>
                </div>

                {transaction.description && (
                    <p className="text-xs text-gray-600 line-clamp-1">
                        {transaction.description}
                    </p>
                )}
            </div>
        </div>
    );
};

const KanbanColumn = ({ status, transactions, onEdit, onDelete }) => {
    const statusInfo = statusConfig[status];
    const Icon = statusInfo.icon;

    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <div className="flex-1 min-w-72">
            <Card className={`${statusInfo.color} h-full ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="h-4 w-4" />
                        {statusInfo.title}
                        <Badge variant="secondary" className="ml-auto">
                            {transactions.length}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {statusInfo.description}
                        {isOver && (
                            <span className="ml-2 text-blue-600 font-medium">
                                • Drop here
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <SortableContext items={transactions.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div ref={setNodeRef} className="space-y-2 max-h-80 overflow-y-auto">
                            {transactions.length === 0 ? (
                                <div className="text-center text-gray-500 text-sm py-8">
                                    {isOver ? (
                                        <div className="text-blue-600 font-medium">
                                            Drop here to move transaction
                                        </div>
                                    ) : (
                                        <div>
                                            No transactions
                                            <div className="text-xs mt-1">
                                                Drag cards from other columns
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                transactions.map((transaction) => (
                                    <TransactionCard
                                        key={transaction.id}
                                        transaction={transaction}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))
                            )}
                        </div>
                    </SortableContext>
                </CardContent>
            </Card>
        </div>
    );
};

const KanbanBoard = ({ transactions, onEdit, onDelete, onStatusChange }) => {
    const [activeId, setActiveId] = React.useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Group transactions by status
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.status]) {
            acc[transaction.status] = [];
        }
        acc[transaction.status].push(transaction);
        return acc;
    }, {});

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        console.log('Drag ended:', {
            activeId: active.id,
            overId: over?.id,
            overData: over?.data?.current
        });

        if (!over) {
            console.log('No drop target found');
            return;
        }

        const activeTransaction = transactions.find(t => t.id === active.id);
        const overColumn = over.id;

        console.log('Active transaction:', activeTransaction);
        console.log('Target column:', overColumn);

        // Check if we're dropping on a valid column
        if (activeTransaction && overColumn && overColumn !== activeTransaction.status &&
            ['todo', 'in-progress', 'done'].includes(overColumn)) {
            console.log('Status change:', activeTransaction.status, '->', overColumn);
            onStatusChange(activeTransaction.id, overColumn);
        } else {
            console.log('Invalid drop:', {
                hasTransaction: !!activeTransaction,
                overColumn,
                currentStatus: activeTransaction?.status,
                isValidColumn: ['todo', 'in-progress', 'done'].includes(overColumn)
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction Management Board</CardTitle>
                <CardDescription>
                    Drag and drop transactions between different stages to manage your money flow
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {Object.keys(statusConfig).map((status) => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                transactions={groupedTransactions[status] || []}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId ? (() => {
                            const draggingTransaction = transactions.find(t => t.id === activeId);
                            return draggingTransaction ? (
                                <div className="p-2 bg-card border rounded-lg shadow-lg opacity-90 max-w-xs">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="h-3 w-3 text-gray-400" />
                                        <span className="text-sm font-medium">
                                            {draggingTransaction.type === 'income' ? 'Income' : 'Expense'}: {draggingTransaction.currency === 'USD' ? '$' : draggingTransaction.currency === 'GBP' ? '£' : '₹'}{draggingTransaction.amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {draggingTransaction.category}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-2 bg-card border rounded-lg shadow-lg opacity-90">
                                    <div className="text-sm font-medium">
                                        Dragging transaction...
                                    </div>
                                </div>
                            );
                        })() : null}
                    </DragOverlay>
                </DndContext>
            </CardContent>
        </Card>
    );
};

export default KanbanBoard;
