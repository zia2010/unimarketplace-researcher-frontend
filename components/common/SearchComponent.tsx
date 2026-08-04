'use client';

import { useEffect, useState } from 'react';
import { Select, Spin, Empty, Dropdown, Button } from 'antd';
import { Search, Settings2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import { resourcesApi } from '@/lib/services/api/resource.api';
import { universityApi } from '@/lib/services/api/university.api';

const { Option } = Select;

export default function SearchableDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const universitiesParam = searchParams.get('universities');
  const searchTermParam = searchParams.get('searchTerm');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'institution'>('name');
  const [uniPage, _] = useState<number>(1);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(
    []
  );
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const searchQuery = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim()) {
        return { data: [], total: 0 };
      }

      const response = await resourcesApi.list({
        searchTerm: debouncedSearch,
        uniId: selectedUniversities,
        page: 1,
        limit: 50,
      });

      return {
        data: response.data ?? [],
        total: response.total ?? 0,
      };
    },
    enabled: !!debouncedSearch.trim() && searchType === 'name',
    staleTime: 1000 * 60 * 5,
  });

  const { data: universityData, isLoading: isLoadingUniversities } = useQuery({
    queryKey: ['universities', searchType === 'institution', uniPage],
    queryFn: async () => {
      const universityData = await universityApi.getUniversities({
        page: uniPage ?? 1,
        limit: 50,
      });
      return universityData;
    },
    enabled: searchType === 'institution',
  });

  const handleResourceSelect = (value: string) => {
    router.push(`/resource/${value}`, { scroll: true });
  };

  const handleUniversityChange = (values: string[]) => {
    setSelectedUniversities(values);
    // When user clears all institutions, revert to search by resource name
    if (values.length === 0) {
      setSearchType('name');
      setSearchTerm('');
      router.push('/resources', { scroll: true });
    }
  };

  const udpateData = async () => {
    // Check for searchTerm parameter first
    if (searchTermParam) {
      setSearchType('name');
      setSearchTerm(searchTermParam);
      setSelectedUniversities([]);
      return;
    }

    // Then check for universities parameter
    if (universitiesParam) {
      const idsFromUrl = universitiesParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      setSearchType('institution');
      setSelectedUniversities(idsFromUrl);
      setSearchTerm('');
      return;
    }

    // If neither parameter exists, reset to defaults
    setSelectedUniversities([]);
    setSearchTerm('');
    setSearchType('name');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      udpateData();
    }, 100);

    return () => clearTimeout(timer);
  }, [universitiesParam, searchTermParam]);

  const settingsMenu = {
    items: [
      {
        key: 'institution',
        label: 'Institution',
        onClick: () => {
          setSearchType('institution');
          setSearchTerm('');
          setSelectedUniversities([]);
        },
      },
    ],
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className='font-semibold text-black'>
          {part}
        </span>
      ) : (
        <span key={index} className='text-gray-500'>
          {part}
        </span>
      )
    );
  };

  const SettingsIcon = (
    <Dropdown menu={settingsMenu} trigger={['hover']} placement='topRight'>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ cursor: 'pointer', padding: '0 8px' }}
      >
        <Settings2 size={18} className='text-gray-400 hover:text-gray-600' />
      </div>
    </Dropdown>
  );

  return (
    <div className='w-full grid place-items-center'>
      {searchType === 'name' ? (
        <Select
          showSearch
          size='large'
          placeholder='Search resources by name'
          onSearch={setSearchTerm}
          value={searchTerm || undefined}
          onChange={setSearchTerm}
          onSelect={handleResourceSelect}
          popupMatchSelectWidth={false}
          className='w-full max-w-[640px]'
          suffixIcon={SettingsIcon}
          prefix={<Search size={18} className='text-gray-400' />}
          loading={searchQuery.isFetching}
          filterOption={false}
          getPopupContainer={(trigger) => trigger.parentElement!}
          notFoundContent={
            searchQuery.isFetching ? (
              <div className='py-6 text-center'>
                <Spin size='small' />
              </div>
            ) : searchTerm.trim() && searchQuery.data?.data?.length === 0 ? (
              <Empty
                description={`No results for "${searchTerm.trim()}"`}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Empty
                description='Start typing to search'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }
          style={{ height: 48 }}
        >
          {!searchQuery.isFetching &&
            searchQuery.data?.data?.map((item) => (
              <Option key={item.id} value={item.id}>
                <div className='py-2'>
                  <div className='font-medium'>
                    {highlightMatch(item.name, searchTerm)}
                  </div>
                </div>
              </Option>
            ))}
        </Select>
      ) : (
        <Select
          mode='multiple'
          size='large'
          placeholder='Select institutions'
          value={selectedUniversities}
          onChange={handleUniversityChange}
          popupMatchSelectWidth={false}
          className='w-full max-w-[640px] [&_.ant-select-selection-item]:max-h-7 [&_.ant-select-selection-item]:leading-6'
          suffixIcon={SettingsIcon}
          prefix={<Search size={18} className='text-gray-400' />}
          maxTagCount='responsive'
          style={{ height: 48 }}
          tagRender={({ label, closable, onClose }) => (
            <span
              className='inline-flex items-center gap-1 max-w-[200px] h-6 rounded px-2 bg-gray-100 text-gray-800 text-sm leading-6'
              title={typeof label === 'string' ? label : undefined}
            >
              <span className='truncate'>{label}</span>
              {closable && (
                <span
                  role='button'
                  tabIndex={0}
                  onClick={onClose}
                  onKeyDown={(e) => e.key === 'Enter' && onClose()}
                  className='shrink-0 cursor-pointer hover:text-gray-600 focus:outline-none'
                  aria-label='Remove'
                >
                  ×
                </span>
              )}
            </span>
          )}
          loading={isLoadingUniversities}
          notFoundContent={
            isLoadingUniversities ? (
              <div className='py-6 text-center'>
                <Spin size='small' />
              </div>
            ) : (
              <Empty
                description='No institutions found'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }
          popupRender={(menu) => (
            <div>
              <div className='max-h-[260px] overflow-y-auto'>{menu}</div>
              <div className='border-t border-gray-200 p-3'>
                <Button
                  type='primary'
                  block
                  disabled={!selectedUniversities.length}
                  onClick={() => {
                    const query = selectedUniversities.join(',');
                    // router.push(`/resources?universities=${query}`);
                    router.push(
                      `/resources?universities=${query}&_=${Date.now()}`,
                      { scroll: true }
                    );
                  }}
                >
                  View Resources
                </Button>
              </div>
            </div>
          )}
        >
          {universityData?.data?.map((uni) => (
            <Option key={uni.id} value={uni.id} label={uni.name}>
              <div className='flex items-center gap-3 py-2'>
                <div className='font-medium text-gray-900'>{uni.name}</div>
                {!uni.isVerified && (
                  <span className='text-xs text-orange-500'>(Unverified)</span>
                )}
              </div>
            </Option>
          ))}
        </Select>
      )}
    </div>
  );
}
