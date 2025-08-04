import Editor, {loader} from "@monaco-editor/react";
import {Box, Tab, Tabs} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import TextEditor from "../../../../components/common/TextEditor"; // Updated import path

const EditorTabs = ({value, onChange, hint = "html"}) => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };
    const monacoRef = useRef(null);

    function handleEditorWillMount(monaco) {
        monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    }

    function handleEditorDidMount(editor, monaco) {
        monacoRef.current = monaco;
    }

    useEffect(() => {
        loader.config({
            paths: {
                vs:
                    process.env.REACT_APP_MONACO_PATH ||
                    "https://unpkg.com/monaco-editor@0.34.0/min/vs",
            },
        });
    }, []);

    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{borderBottom: 1, borderColor: "divider", mb: 2}}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="editor tabs"
                    textColor="primary"
                    indicatorColor="primary"
                >

                    <Tab label="ویرایشگر متن"/>
                    <Tab label="ویرایشگر کد"/>
                </Tabs>
            </Box>

            <Box sx={{mt: 2}}>
                {currentTab === 1 ? (
                    <div className="ltrForEditor">
                        <Editor
                            height="500px"
                            defaultLanguage="html"
                            className="ltrFor w-full"
                            defaultValue={`// Write your JSX code here

    <div>
      <h1>Hello, JSX!</h1>
    </div>
 `}
                            value={value}
                            onChange={onChange}
                            theme="vs-dark"
                            options={{
                                minimap: {enabled: true},
                                automaticLayout: true,
                                tabSize: 2,
                                fontSize: 14,
                                lineNumbers: "on",
                                wordWrap: "on",
                            }}
                        />
                    </div>
                ) : (
                    <TextEditor value={value} change={onChange} hint={hint}/>
                )}
            </Box>
        </Box>
    );
};

export default EditorTabs;
