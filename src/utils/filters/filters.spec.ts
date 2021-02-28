import { ListItem } from '../../types';
import { filter } from './filters';

describe('filters', () => {
  const items: Array<ListItem> = [];
  const tags: Array<Array<string>> = [
    ['tag1', 'tag2'],
    ['tag3', 'tag4'],
    ['tag5', 'tag6'],
    ['tag3', 'tag7'],
    ['tag6', 'tag8'],
  ];

  for (let i = 0; i < 5; i++) {
    items.push({
      title: `item ${i}`,
      body: 'body',
      image: 'image',
      link: 'link',
      tags: tags[i],
    });
  }

  describe('undefined or empty items/tags', () => {
    it('should return undefined when items are empty', () => {
      const filteredAny = filter('any', [], ['tag1', 'tag5']);
      expect(filteredAny).toBeUndefined();

      const filteredAll = filter('all', [], ['tag1', 'tag5']);
      expect(filteredAll).toBeUndefined();

      const filteredNone = filter('none', [], ['tag1', 'tag5']);
      expect(filteredNone).toBeUndefined();
    });

    it('should return undefined when items are undefined', () => {
      // @ts-ignore
      const filteredAny = filter('any', undefined, ['tag2', 'tag6']);
      expect(filteredAny).toBeUndefined();

      // @ts-ignore
      const filteredAll = filter('all', undefined, ['tag2', 'tag6']);
      expect(filteredAll).toBeUndefined();

      // @ts-ignore
      const filteredNone = filter('none', undefined, ['tag2', 'tag6']);
      expect(filteredNone).toBeUndefined();
    });

    it('should return undefined when tags are empty', () => {
      const filteredAny = filter('any', items, []);
      expect(filteredAny).toBeUndefined();

      const filteredAll = filter('all', items, []);
      expect(filteredAll).toBeUndefined();

      const filteredNone = filter('none', items, []);
      expect(filteredNone).toBeUndefined();
    });

    it('should return undefined when tags are undefined', () => {
      // @ts-ignore
      const filteredAny = filter('any', items, undefined);
      expect(filteredAny).toBeUndefined();

      // @ts-ignore
      const filteredAll = filter('all', items, undefined);
      expect(filteredAll).toBeUndefined();

      // @ts-ignore
      const filteredNone = filter('none', items, undefined);
      expect(filteredNone).toBeUndefined();
    });

    it('should return undefined when filter type does not exist', () => {
      // @ts-ignore
      const filtered = filter('nofilter', items, ['tag2, tag6']);
      expect(filtered).toBeUndefined();
    });
  });

  describe('filterAny', () => {
    it('should return 3 items', (done) => {
      const filtered = filter('any', items, ['tag6', 'tag5', 'tag2']);
      expect(filtered).toHaveLength(3);
      if (!filtered) return done(new Error('Filtered is undefined'));
      expect(filtered[0].title).toEqual('item 0');
      expect(filtered[1].title).toEqual('item 2');
      expect(filtered[2].title).toEqual('item 4');
      done();
    });

    it('should return empty array when no tags match', () => {
      const filtered = filter('any', items, ['tag10', 'tag0']);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('filterAll', () => {
    it('should return one item', (done) => {
      const filtered = filter('all', items, ['tag6', 'tag8']);
      expect(filtered).toHaveLength(1);
      if (!filtered) return done(new Error('Filtered is undefined'));
      expect(filtered[0].title).toEqual('item 4');
      done();
    });

    it('should return empty array when item does not have all tags', () => {
      const filtered = filter('all', items, ['tag1', 'tag4']);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('filterNone', () => {
    it('should return one item', (done) => {
      const filtered = filter('none', items, ['tag3', 'tag6']);
      expect(filtered).toHaveLength(1);
      if (!filtered) return done(new Error('Filtered is undefined'));
      expect(filtered[0].title).toEqual('item 0');
      done();
    });

    it('should return all items', () => {
      const filtered = filter('none', items, ['tag9']);
      expect(filtered).toHaveLength(items.length);
    });

    it('should return empty array', () => {
      const filtered = filter('none', items, ['tag1', 'tag3', 'tag6']);
      expect(filtered).toHaveLength(0);
    });
  });
});
