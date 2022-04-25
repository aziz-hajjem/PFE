const handlebars = require("handlebars");
var source = `
import ForgeUI, {
    render,
    Text,
    ContentAction,
    ModalDialog,
    useState,
    useProductContext,
    Image,
    CheckboxGroup,
    Form,
    Checkbox,
    Select,
    Option,
    Tag,
    DateLozenge,
    User,
  } from "@forge/ui";
  
  const App = () => {
    const [isOpen, setOpen] = useState(true);
    const onSubmit = (formData) => {
     
      console.log(formData);
      
    }
    const context = useProductContext();
  
    if (!isOpen) {
      return null;
    }
  
    return (
      <ModalDialog header="{{{title}}}" onClose={() => setOpen(false)}>
        {{{data}}}
      </ModalDialog>
    );
  };
  
  export const run = render(
    <ContentAction>
      <App />
    </ContentAction>
  );
`;
var contentActionTemplate = handlebars.compile(source);
module.exports = contentActionTemplate;
