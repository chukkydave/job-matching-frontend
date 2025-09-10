import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    title,
    subtitle,
    actions,
    className = '',
}) => {
    return (
        <div className={`max-w-7xl mx-auto ${className}`}>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-instollar-dark mb-2">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-gray-600 text-sm sm:text-base">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex-shrink-0">
                            {actions}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            {children}
        </div>
    );
};

interface LoadingStateProps {
    message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Loading...'
}) => (
    <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-instollar-dark mx-auto mb-4"></div>
                <div className="text-lg text-gray-600">{message}</div>
            </div>
        </div>
    </div>
);

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    action,
}) => (
    <div className="text-center py-8 sm:py-12">
        <div className="text-gray-500 text-lg mb-4">{title}</div>
        {description && (
            <div className="text-gray-400 text-sm mb-6">{description}</div>
        )}
        {action && <div>{action}</div>}
    </div>
);
