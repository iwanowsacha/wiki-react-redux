import tinymce from "tinymce";
import { ArticleSection } from "../types";

let _sections: Array<any> = [];
// let sections: Array<ArticleSection> = [];

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
                }
            }
        )
    }
    
        // function _onAction() {
        //     console.log('action');
        //     //@ts-ignore
        //     _dialog = editor.windowManager.open(_getDialogConfig());
        // }
    
        editor.ui.registry.addButton('section-anchor', {
            text: 'Section Anchor',
            icon: 'bookmark',
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
    _sections = [];
    sections.map((v) => {
        sectionTraverse('', v);
    });
    if (tinymce.PluginManager.get('section-anchor')) return;
    addSectionAnchorPlugin();
}