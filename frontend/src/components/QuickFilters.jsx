import { useState } from 'react';
import { Filter, X, DollarSign, TrendingUp, Star, Clock } from 'lucide-react';

function QuickFilters({ onFilterChange, games = [] }) {
  const [activeFilters, setActiveFilters] = useState({
    platform: [],
    priceRange: null,
    sortBy: 'default'
  });
  const [showFilters, setShowFilters] = useState(false);

  const platforms = ['Steam', 'PlayStation', 'Xbox', 'Nintendo', 'Epic Games'];
  const priceRanges = [
    { label: 'ทั้งหมด', min: 0, max: Infinity },
    { label: 'ต่ำกว่า 500฿', min: 0, max: 500 },
    { label: '500-1,000฿', min: 500, max: 1000 },
    { label: '1,000-2,000฿', min: 1000, max: 2000 },
    { label: 'มากกว่า 2,000฿', min: 2000, max: Infinity },
  ];

  const handlePlatformToggle = (platform) => {
    const newPlatforms = activeFilters.platform.includes(platform)
      ? activeFilters.platform.filter(p => p !== platform)
      : [...activeFilters.platform, platform];
    
    const newFilters = { ...activeFilters, platform: newPlatforms };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    const newFilters = { ...activeFilters, priceRange: range };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy) => {
    const newFilters = { ...activeFilters, sortBy };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = { platform: [], priceRange: null, sortBy: 'default' };
    setActiveFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = activeFilters.platform.length > 0 || activeFilters.priceRange || activeFilters.sortBy !== 'default';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-gray-800 dark:text-white">ตัวกรองและเรียงลำดับ</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
          >
            <X className="w-4 h-4" /> ล้างทั้งหมด
          </button>
        )}
      </div>

      {/* Platform Filters */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">แพลตฟอร์ม</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeFilters.platform.includes(platform)
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
          <DollarSign className="w-4 h-4" /> ราคา
        </p>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePriceRangeChange(range)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeFilters.priceRange?.label === range.label
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" /> เรียงลำดับ
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'default', label: 'ค่าเริ่มต้น', icon: Clock },
            { value: 'price-low', label: 'ราคาต่ำ → สูง', icon: DollarSign },
            { value: 'price-high', label: 'ราคาสูง → ต่ำ', icon: DollarSign },
            { value: 'name', label: 'ชื่อ A-Z', icon: TrendingUp },
            { value: 'newest', label: 'ใหม่ล่าสุด', icon: Clock },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
                  activeFilters.sortBy === option.value
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuickFilters;




