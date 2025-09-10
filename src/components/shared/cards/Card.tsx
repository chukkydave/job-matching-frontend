import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false,
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const hoverClasses = hover ? 'hover:shadow-md transition-shadow' : '';
    const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';

    const classes = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`.trim();

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className = '' }) => (
    <Card className={className}>
        <div className="flex items-center">
            <div className="w-12 h-12 bg-instollar-yellow rounded-lg flex items-center justify-center mr-4">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-instollar-dark">{value}</p>
                <p className="text-gray-600">{title}</p>
            </div>
        </div>
    </Card>
);
