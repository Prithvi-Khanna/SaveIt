import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProductsAsync } from '../store/Slices/ProductsSlice';
import { addToCart } from '../store/Slices/CartSlice';
import { logout } from '../store/Slices/AuthSlice';

import { AppDispatch, RootState } from '../store';
import ProductCard from '../Components/ProductCard';
import ProductSkeleton from '../Components/ProductSkeleton';

import CartIcon from '../Assets/icons/cart.svg';
import CloseIcon from '../Assets/icons/close.svg';
import SearchIcon from '../Assets/icons/search.svg';
import LogoutIcon from '../Assets/icons/logout.svg';
import { Product } from '@/Types';

const PER_PAGE = 8;

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const productsState = useSelector((s: RootState) => s.products);
  const email = useSelector((s: RootState) => s.auth.email);
  const cartCount = useSelector((s: RootState) => s.cart.items.length);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // API fetch
  useEffect(() => {
    if (productsState.status === 'idle') {
      dispatch(fetchProductsAsync());
    }
  }, []);

  // Filter products only once per search input
  const filteredList = useMemo(() => {
    return productsState.items.filter(product =>
      product.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [productsState.items, debouncedQuery]);

  // Paginated slice
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredList.slice(start, start + PER_PAGE);
  }, [filteredList, page]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredList.length / PER_PAGE));
  }, [filteredList]);

  const onAddToCart = useCallback(
    (product: Product) => {
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        }),
      );
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <View style={styles.cardWrapper}>
        <ProductCard product={item} onAdd={onAddToCart} />
      </View>
    ),
    [onAddToCart],
  );

  const skeletonItems = useMemo(() => [1, 2, 3, 4], []);

  return (
    <View style={styles.flexOne}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => dispatch(logout())}>
          <LogoutIcon width={26} height={26} stroke="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarText}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <CartIcon width={26} height={26} stroke="#fff" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {email ?? 'User'} 👋</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchIcon width={22} height={22} stroke="#777" />
        <TextInput
          placeholder="Search products..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <CloseIcon width={18} height={18} />
          </TouchableOpacity>
        )}
      </View>

      {/* LOADING STATE → Show Skeleton Grid*/}
      {productsState.status === 'loading' && (
        <FlatList
          data={skeletonItems}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => String(item)}
          renderItem={() => (
            <View style={styles.cardWrapper}>
              <ProductSkeleton />
            </View>
          )}
        />
      )}

      {/* ERROR STATE                     */}
      {productsState.status === 'failed' && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>
            {productsState.error ?? 'Unable to load products'}
          </Text>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchProductsAsync())}
          >
            <Text style={styles.retry}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* EMPTY STATE (no results)        */}
      {productsState.status === 'succeeded' && paginatedItems.length === 0 && (
        <View style={styles.centerBox}>
          <Text style={styles.noData}>No products found</Text>
        </View>
      )}

      {/* SUCCESS → PRODUCT LIST         */}
      {productsState.status === 'succeeded' && paginatedItems.length > 0 && (
        <FlatList
          data={paginatedItems}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listStyle}
        />
      )}

      {/* PAGINATION */}
      <View style={styles.pager}>
        <TouchableOpacity
          disabled={page <= 1}
          onPress={() => setPage(p => Math.max(1, p - 1))}
        >
          <Text style={styles.pagerBtn}>Previous</Text>
        </TouchableOpacity>

        <Text>
          Page {page} / {totalPages}
        </Text>

        <TouchableOpacity
          disabled={page >= totalPages}
          onPress={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          <Text style={styles.pagerBtn}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('Cart')}
      >
        <CartIcon width={26} height={26} stroke="#fff" />
        {cartCount > 0 && (
          <View style={styles.floatBadge}>
            <Text style={styles.floatBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: '#d7e9fdff' },
  retry: { color: '#fff', fontSize: 15, fontWeight: '600' },
  listStyle: { paddingHorizontal: 12, paddingBottom: 100 },
  topBar: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6faaf7ff',
  },
  topBarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  header: { paddingHorizontal: 12, marginBottom: 6 },
  greeting: { fontSize: 20, fontWeight: '700' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 12,
    marginVertical: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: '48%',
  },

  centerBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: '#4c8df5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  noData: {
    fontSize: 16,
    color: '#666',
  },

  pager: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  pagerBtn: {
    color: '#2b6cb0',
    fontSize: 15,
  },

  floatingBtn: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    backgroundColor: '#82b7f4ff',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  floatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
  },
  floatBadgeText: { color: '#fff', fontSize: 12 },
});
