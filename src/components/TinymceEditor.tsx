import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Spinner from './Spinner';

type TinymceEditorProps = {
    isInline?: boolean;
    height?: string;
    editorContent: string;
    onEditorContentChange: (content: string) => void;
}

export default function TinymceEditor(props: TinymceEditorProps) {
    const { editorContent, onEditorContentChange, height = '100%', isInline = false } = props;
    const plugins = isInline ? 'lists' : 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help quickbars';
    const toolbar = isInline ? 'undo redo | bold italic underline strikethrough | link lists | forecolor backcolor' : 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl';
    const [isActive, setIsActive] = useState(isInline);

    const handleEditorReady = () => setIsActive(true);

    return(
        <>
            {!isActive &&
                <Spinner />
            }
            <span className={!isActive ? 'hidden' : ''}>
                <Editor
                        init={{
                            skin_url: `../assets/tinymce/skins/ui/my-wiki/`,
                            content_css: `../assets/tinymce/skins/content/my-wiki/content.min.css`,
                            inline: isInline,
                            height: height,
                            min_height: 300,
                            plugins: plugins,
                            menubar: isInline ? false : 'file edit view insert format tools table tc help',
                            toolbar: toolbar
                        }}
                        value={editorContent}
                        onEditorChange={onEditorContentChange}
                        onInit={handleEditorReady}
                    />
            </span>
        </>
    );
}