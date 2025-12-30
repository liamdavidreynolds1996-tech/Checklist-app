import { useState, useMemo } from 'react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

const SHOPPING_STORAGE_KEY = 'checklistShoppingList';

function loadShoppingList(): ShoppingItem[] {
  const stored = localStorage.getItem(SHOPPING_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveShoppingList(items: ShoppingItem[]) {
  localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(items));
}

const ITEM_CATEGORIES = [
  { id: 'produce', name: 'Produce', icon: '🥬' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'meat', name: 'Meat & Fish', icon: '🥩' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
  { id: 'frozen', name: 'Frozen', icon: '🧊' },
  { id: 'pantry', name: 'Pantry', icon: '🥫' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'household', name: 'Household', icon: '🧹' },
  { id: 'other', name: 'Other', icon: '📦' },
];

// Auto-categorize items based on common keywords
function autoDetectCategory(itemName: string): string {
  const name = itemName.toLowerCase();

  // Produce
  if (/\b(apple|banana|orange|lettuce|tomato|onion|potato|carrot|broccoli|spinach|fruit|vegetable|salad|herb|garlic|lemon|lime|avocado|pepper|cucumber|celery|mushroom)\b/.test(name)) {
    return 'produce';
  }
  // Dairy
  if (/\b(milk|cheese|yogurt|butter|cream|egg|eggs)\b/.test(name)) {
    return 'dairy';
  }
  // Meat
  if (/\b(chicken|beef|pork|fish|salmon|tuna|shrimp|bacon|sausage|steak|meat|turkey|ham)\b/.test(name)) {
    return 'meat';
  }
  // Bakery
  if (/\b(bread|roll|bagel|croissant|muffin|cake|pastry|baguette|tortilla)\b/.test(name)) {
    return 'bakery';
  }
  // Frozen
  if (/\b(frozen|ice cream|pizza|fries)\b/.test(name)) {
    return 'frozen';
  }
  // Pantry
  if (/\b(pasta|rice|cereal|flour|sugar|oil|sauce|soup|can|beans|spice|salt|pepper|vinegar|honey|peanut butter|jam|coffee|tea)\b/.test(name)) {
    return 'pantry';
  }
  // Beverages
  if (/\b(juice|soda|water|beer|wine|drink|cola|sprite)\b/.test(name)) {
    return 'beverages';
  }
  // Household
  if (/\b(soap|detergent|paper towel|toilet paper|cleaner|sponge|trash bag|tissue)\b/.test(name)) {
    return 'household';
  }

  return 'other';
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(loadShoppingList);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const updateItems = (newItems: ShoppingItem[]) => {
    setItems(newItems);
    saveShoppingList(newItems);
  };

  const addItem = (input: string) => {
    if (!input.trim()) return;

    // Parse quantity if present (e.g., "2 apples", "1kg chicken", "milk x2")
    let name = input.trim();
    let quantity = '';

    // Match patterns like "2 apples", "3x milk", "chicken 500g"
    const qtyMatch = name.match(/^(\d+(?:\.\d+)?(?:\s*(?:kg|g|lb|oz|ml|l|x))?)\s+(.+)$/i) ||
                     name.match(/^(.+?)\s+(\d+(?:\.\d+)?(?:\s*(?:kg|g|lb|oz|ml|l|x))?)$/i) ||
                     name.match(/^(.+?)\s*x\s*(\d+)$/i);

    if (qtyMatch) {
      if (/^\d/.test(qtyMatch[1])) {
        quantity = qtyMatch[1];
        name = qtyMatch[2];
      } else {
        name = qtyMatch[1];
        quantity = qtyMatch[2];
      }
    }

    const category = selectedCategory || autoDetectCategory(name);

    const item: ShoppingItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      quantity,
      category,
      checked: false,
    };
    updateItems([...items, item]);
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    updateItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    updateItems(items.filter(item => item.id !== id));
  };

  const clearChecked = () => {
    updateItems(items.filter(item => !item.checked));
  };

  const clearAll = () => {
    updateItems([]);
  };

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    items.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  const checkedCount = items.filter(i => i.checked).length;

  const exportToCSV = () => {
    const csv = [
      ['Item', 'Quantity', 'Category', 'Checked'],
      ...items.map(i => [i.name, i.quantity, i.category, i.checked ? 'Yes' : 'No'])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900 border-2 border-yellow-400 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🛒 Shopping List
            </h2>
            <p className="text-yellow-400 mt-1">
              {items.length} items {checkedCount > 0 && `• ${checkedCount} checked`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportToCSV}
              disabled={items.length === 0}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Export CSV
            </button>
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg text-sm font-medium transition-colors"
              >
                Clear Checked ({checkedCount})
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter for Adding */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selectedCategory === null
              ? 'bg-yellow-400 text-black'
              : 'bg-zinc-900 text-zinc-400 hover:text-yellow-400 border border-zinc-800'
          }`}
        >
          Auto-detect
        </button>
        {ITEM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === cat.id
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-yellow-400 border border-zinc-800'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Add Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem(newItem)}
          placeholder="Add item (e.g., '2 apples', 'milk', 'chicken 500g')..."
          className="flex-1 px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-400 placeholder-zinc-600"
        />
        <button
          onClick={() => addItem(newItem)}
          disabled={!newItem.trim()}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-xl text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {/* Shopping List */}
      {items.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🛒</div>
          <h3 className="text-lg font-medium text-white mb-2">Your shopping list is empty</h3>
          <p className="text-zinc-500">
            Add items above - quantities and categories are auto-detected!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ITEM_CATEGORIES.map((category) => {
            const categoryItems = groupedItems[category.id];
            if (!categoryItems || categoryItems.length === 0) return null;

            return (
              <div
                key={category.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium text-yellow-400">{category.name}</span>
                  <span className="text-sm text-zinc-500 ml-auto">
                    {categoryItems.filter(i => i.checked).length}/{categoryItems.length}
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                        item.checked
                          ? 'bg-zinc-800/30 opacity-60'
                          : 'bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
                          item.checked
                            ? 'bg-yellow-400 border-yellow-400'
                            : 'border-zinc-500 hover:border-yellow-400'
                        }`}
                      >
                        {item.checked && (
                          <svg className="w-full h-full text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 ${item.checked ? 'line-through text-zinc-500' : 'text-white'}`}>
                        {item.name}
                      </span>
                      {item.quantity && (
                        <span className="text-sm text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">{item.quantity}</span>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
