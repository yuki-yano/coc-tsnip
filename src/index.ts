import { CompleteResult, events, ExtensionContext, sources, VimCompleteItem, workspace } from 'coc.nvim';

const sourceName = 'tsnip';

export const activate = async (context: ExtensionContext): Promise<void> => {
  context.subscriptions.push(
    sources.createSource({
      name: sourceName,
      shortcut: 'tsnip',
      doComplete: async (option) => {
        if (option.input === '') {
          return {
            items: [],
          };
        }

        const items = await getCompletionItems();
        return items;
      },
    })
  );

  events.on('CompleteDone', async (item: VimCompleteItem) => {
    if (item.source !== sourceName) {
      return;
    }

    await workspace.nvim.call('feedkeys', ['', 'nit']);
    if ((await workspace.nvim.call('mode')) !== 'i') {
      return;
    }

    await workspace.nvim.call('tsnip#remove_suffix_word', [item.word]);
    await workspace.nvim.command('redraw');
    await workspace.nvim.command(`TSnip ${item.word}`);
  });
};

const getCompletionItems = async (): Promise<CompleteResult> => {
  const snippets = (await workspace.nvim.call('tsnip#items')) as Array<{ word: string; info: string }>;

  return {
    items: snippets.map(({ word, info }) => {
      return {
        kind: ' ',
        word,
        info,
        dup: 1,
      };
    }),
    priority: 1000,
  };
};
