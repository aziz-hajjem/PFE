const handlebars = require("handlebars");
var source = `
import ForgeUI, { render, Form, TextField,ContextMenu,InlineDialog,useProductContext,Fragment,Avatar,useState,Image,CheckboxGroup,Text,Checkbox,Select,Option,Tag,DateLozenge,User,UserPicker,DatePicker    } from '@forge/ui';

const App = () => {
  const [user,setUser]=useState('')
  const [date,setDate]=useState('')
  const onSubmit = (formData) => {
   
    console.log(formData);
    

  }
  {{{form}}}
  const context = useProductContext();

  return (
    <InlineDialog>
    {{{data}}}
    </InlineDialog>
  );
};

export const run = render(
    <ContextMenu>
      <App />
    </ContextMenu>
);
`;
var contextMenuTemplate = handlebars.compile(source);
module.exports = contextMenuTemplate;
