import tinymce from "tinymce";
import { ArticleSection, DirectoriesList } from "../types";

let _sections: Array<any> = [];
let _documents: any = {};

function addDocumentLinkPlugin() {
    tinymce.PluginManager.add('document-link', (editor, _url) => {

        const openDialog = function () {
            let currentTab = 'articlesTab';
            return editor.windowManager.open(
                {
                    title: 'Document Link',
                    body: {
                        type: 'tabpanel',
                        tabs: [
                            {
                                title: 'Articles',
                                name: 'articlesTab',
                                items: [
                                    {
                                        type: 'selectbox',
                                        name: 'article',
                                        label: 'Choose an article',
                                        items: _documents.articles
                                    },
                                    {
                                        type: 'input',
                                        name: 'text',
                                        label: 'Text to display'
                                    }
                                ]
                            },
                            {
                                title: 'Lists',
                                name: 'listsTab',
                                items: [
                                    {
                                        type: 'selectbox',
                                        name: 'list',
                                        label: 'Choose a list',
                                        items: _documents.lists
                                    },
                                    {
                                        type: 'input',
                                        name: 'text',
                                        label: 'Text to display'
                                    }
                                ]
                            }
                        ]
                    },
                    buttons: [
                        {
                            text: 'Close',
                            type: 'cancel'
                        },
                        {
                            text: 'Insert',
                            type: 'submit',
                            primary: true
                        }
                    ],
                    initialData: {
                        text: editor.selection.getContent({format: 'text'})
                    },
                    onSubmit: function (api) {
                        const { article, list, text} = api.getData();
                        let title = '';
                        let link = `<a target="_blank" href="`;
                        if (currentTab === 'articlesTab' && article) {
                            link += `locala://${article}">`;
                            title = article;
                        } else if (currentTab === 'listsTab' && list) {
                            link += `locall://${list}">`;
                            title = list;
                        }
                        if (!link.endsWith('>')) return;

                        link += `${text || title}</a>`;

                        if (editor.selection.getContent()) {
                            editor.selection.setContent(link, {format: 'html'});
                        } else {
                            editor.insertContent(link, {format: 'html'});
                        }
                        editor.windowManager.close();
                    },
                    onTabChange: function(_api, details) {
                        currentTab = details.newTabName;
                    }
                }
            );
        }

        editor.ui.registry.addButton('document-link', {
            icon: 'link',
            tooltip: 'Link to another document',
            onAction: openDialog
        });
    });
}

function addSectionAnchorPlugin() {
    tinymce.PluginManager.add('section-anchor', (editor, _url) => {

        const openDialog = function () {
            return editor.windowManager.open(
                {
                    title: 'Section Anchor',
                    body: {
                        type: 'panel',
                        items: [{
                            type: 'selectbox',
                            name: 'section',
                            label: 'Choose section',
                            items: _sections
                        },
                        {
                            type: 'input',
                            name: 'text',
                            label: 'Text to display',
                        }]
                    },
                    buttons: [
                        {
                            text: 'Close',
                            type: 'cancel',
                        },
                        {
                            text: 'Insert',
                            type: 'submit',
                            primary: true
                        }
                    ],
                    initialData: {
                        text: editor.selection.getContent({format: 'text'})
                    },
                    onSubmit: function (api) {
                        const { text, section } = api.getData();
                        const link = `<a href='#${section.replace(/\s---\s/g, '---')}'>${text || section}</a>`;
                        if (editor.selection.getContent()) {
                            editor.selection.setContent(link, {format: 'html'});
                        } else {
                            editor.insertContent(link, {format: 'html'});
                        }
                        editor.windowManager.close();
                    },
                }
            )
        }
    
        editor.ui.registry.addButton('section-anchor', {
            icon: 'bookmark',
            tooltip: 'link to section',
            onAction: openDialog
        });
    });
}

function sectionTraverse (parent: string, section: ArticleSection) {
    let par = parent ? `${parent} --- ${section.title}` : section.title;
    _sections.push({text: par, value: par});
    section.sections.map((v) => sectionTraverse(par, v));
}

export function initSectionAnchor(sections: Array<ArticleSection>) {
    _sections = [{text: 'Introduction', value: 'intro'}];
    sections.map((v) => {
        sectionTraverse('', v);
    });
    if (tinymce.PluginManager.get('section-anchor')) return;
    addSectionAnchorPlugin();
}

export function initDocumentLink(documents: DirectoriesList) {
    _documents.articles = documents.articles.map((a) => { return {text: a, value: a}});
    _documents.lists = documents.lists.map((l) => { return {text: l, value: l}});
    if (tinymce.PluginManager.get('document-link')) return;
    addDocumentLinkPlugin();
}