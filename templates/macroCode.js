const macroCode=(el,forgeTemplate,zip)=>{
 
    var macro;
    var dat = [];
    var conf=[];
    var def=[];
    const defaultColor=`Color:"red"
    `
    const defaultConfigColor=`
    <Select label="colors" name="Color" >
    <Option defaultSelected label="🔴 red" value="red" />
    <Option label="🟢 green" value="green" />
    <Option label="🔵 blue" value="blue" />
    <Option label="🟣 purple" value="purple" />
    <Option label="🟡 yellow" value="yellow" />
    <Option label="🔵 teal" value="teal" />
    <Option label="🎗️ red-light" value="red-light" />
  </Select>
  `
    el.paramter.find((el) => el === "User") &&
      dat.push(`<User accountId={config.user} />
`)&&def.push(`user:context.accountId`)&&conf.push(`<UserPicker label="User" name="user" />
`);
    el.paramter.find((el) => el === "Date") &&
      dat.push(`
      <Text>
      Date is : <DateLozenge value={config.date?new Date(config.date).getTime():new Date().getTime()} />
    </Text> 
`)&&def.push(`date:new Date().getTime()
`)&&conf.push(`<DatePicker name="date" label="Choose Date" />
`);
    el.paramter.find((el) => el === "Text") &&
      dat.push(`<Text>{config.Text}</Text>
`)&&conf.push(`<TextField
name="Text"
label="Text"
defaultValue={defaultConfig.Text}
/>
`)&&def.push(`Text:"${el.text}"
`)
    el.paramter.find((el) => el === "Tag") &&
      dat.push(`<Tag text="${el.tag}" color={config.Color}/>
`)&&(!def.find(el=>el===defaultColor)&&def.push(defaultColor)&&conf.push(defaultConfigColor))
    el.paramter.find((el) => el === "Image") &&
      dat.push(`<Image size='medium' src="${el.image}" alt="image" />
 `);
    el.paramter.find((el) => el === "CheckBox") &&
      dat.push(`<Tag text={config.checkBox} color={config.Color}/>
`)&&conf.push(`
<CheckboxGroup name="checkBox" label="checkBox">
      ${el.checkBox
        .map(
          (el) => `<Checkbox value="${el}" label="${el}" />
      `
        )
        .join("")}
    </CheckboxGroup>
`)&&def.push(`
checkBox:"checkBox"
`)&&(!def.find(el=>el===defaultColor)&&def.push(defaultColor)&&conf.push(defaultConfigColor))
el.paramter.find((el) => el === "Select") &&
dat.push(`<Tag text={config.select} color={config.Color}/>
`)&&conf.push(`
<Select name="select" label="select">
${el.select
  .map(
    (el) => `<Option value="${el}" label="${el}" />
`
  )
  .join("")}
</Select>
`)&&def.push(`
select:"select"
`)&&(!def.find(el=>el===defaultColor)&&def.push(defaultColor)&&conf.push(defaultConfigColor))

    macro = {
      data: dat.join(""),
      defaultConfig:(el.paramter.find(el=>el==="Text")||el.paramter.find(el=>el==="Tag")||el.paramter.find(el=>el==="Select")||el.paramter.find(el=>el==="CheckBox"))&&(`const defaultConfig = {
        ${def.join(",")}
      };
      `),
      config:(el.paramter.find(el=>el==="Text")||el.paramter.find(el=>el==="Tag")||el.paramter.find(el=>el==="Select")||el.paramter.find(el=>el==="CheckBox"))&&( `
const Config = () => {
return (
  <MacroConfig>
      ${conf.join("")}
  </MacroConfig>
        );
};
                
export const config = render(<Config />);
`),
    };
   
    var macroData = forgeTemplate(macro);
    zip.addFile(
      `src/${el.name.split(' ').join("-")}.jsx`,
      Buffer.from(macroData, "utf8"),
      "entry comment goes here"
    );
}

module.exports=macroCode