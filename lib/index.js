var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/index.ts
__markAsModule(exports);
__export(exports, {
  activate: () => activate
});
var import_coc = __toModule(require("coc.nvim"));
var sourceName = "tsnip";
var activate = async (context) => {
  context.subscriptions.push(import_coc.sources.createSource({
    name: sourceName,
    shortcut: "tsnip",
    doComplete: async (option) => {
      if (option.input === "") {
        return {
          items: []
        };
      }
      const items = await getCompletionItems();
      return items;
    }
  }));
  import_coc.events.on("CompleteDone", async (item) => {
    if (item.source !== sourceName) {
      return;
    }
    await import_coc.workspace.nvim.call("feedkeys", ["", "nit"]);
    if (await import_coc.workspace.nvim.call("mode") !== "i") {
      return;
    }
    await import_coc.workspace.nvim.call("tsnip#remove_suffix_word", [item.word]);
    await import_coc.workspace.nvim.command("redraw");
    await import_coc.workspace.nvim.command(`TSnip ${item.word}`);
  });
};
var getCompletionItems = async () => {
  const snippets = await import_coc.workspace.nvim.call("tsnip#items");
  return {
    items: snippets.map(({word, info}) => {
      return {
        kind: "\uEB66 ",
        word,
        info,
        dup: 1
      };
    }),
    priority: 1e3
  };
};
