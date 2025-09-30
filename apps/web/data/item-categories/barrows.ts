import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { compoundItem } from '../utils/item-builders';

export const barrows: ItemCategory = {
    image: formatWikiImageUrl('Chest_(Barrows,_open)', 'category'),
    items: [
        compoundItem({
            name: 'Ahrim\'s armour set',
            requiredItems: [
                { clogName: 'Ahrim\'s hood' },
                { clogName: 'Ahrim\'s staff' },
                { clogName: 'Ahrim\'s robetop' },
                { clogName: 'Ahrim\'s robeskirt' }
            ],
            collectionLogCategories: ['barrows_chests'],
            points: 10,
        }),
        compoundItem({
            name: 'Dharok\'s armour set',
            requiredItems: [{ clogName: 'Dharok\'s helm' },
            { clogName: 'Dharok\'s greataxe' },
            { clogName: 'Dharok\'s platebody' },
            { clogName: 'Dharok\'s platelegs' }
            ],
            collectionLogCategories: ['barrows_chests'],
            points: 10,
        }),
        compoundItem({
            name: 'Guthan\'s armour set',
            requiredItems: [{ clogName: 'Guthan\'s helm' },
            { clogName: 'Guthan\'s warspear' },
            { clogName: 'Guthan\'s platebody' },
            { clogName: 'Guthan\'s chainskirt' }
            ],
            collectionLogCategories: ['barrows_chests'],
            points: 10,
        }),
        compoundItem({
            name: 'Karil\'s armour set',
            requiredItems: [{ clogName: 'Karil\'s coif' },
            { clogName: 'Karil\'s crossbow' },
            { clogName: 'Karil\'s leatherskirt' },
            { clogName: 'Karil\'s leatherskirt' }
            ],
            collectionLogCategories: ['barrows_chests'],
            points: 10,
        }),
        compoundItem({
            name: 'Torag\'s armour set',
            requiredItems: [{ clogName: 'Torag\'s helm' },
            { clogName: 'Torag\'s hammers' },
            { clogName: 'Torag\'s platebody' },
            { clogName: 'Torag\'s platelegs' }
            ],
            collectionLogCategories: ['barrows_chests'],
            points: 10,
        }),
        compoundItem({
            name: 'Verac\'s armour set',
            requiredItems: [{ clogName: 'Verac\'s helm' },
            { clogName: 'Verac\'s flail' },
            { clogName: 'Verac\'s brassard' },
            { clogName: 'Verac\'s plateskirt' }
            ],
            collectionLogCategories: ['barrows_chests'],
            points: 10,
        })
    ]
}