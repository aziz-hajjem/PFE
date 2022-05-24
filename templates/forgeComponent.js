const forgeComponent=(el,forgeTemplate,zip)=>{
 
        var spaceData;
        var dat = [];
        var form=[];
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={user?user:context.accountId} />
  `)&&form.push(`
  const onClick = (formData) => {
    setUser(formData.user);
  };
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date  is : <DateLozenge value={date?new Date(date).getTime():new Date().getTime()} />
  </Text> 
 
  `)&&form.push(`
  const onDatePick = (formData) => {
   
    console.log(formData.date)
    setDate(formData.date)
    
  }
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
    `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
    `);
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
     `);
        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
    <Form onSubmit={onSubmit} >
      <CheckboxGroup name="CheckBox" label="CheckBox">
          ${el.checkBox
            .map(
              (el) => `<Checkbox value="${el}" label="${el}" />
          `
            )
            .join("")}
        </CheckboxGroup>
    </Form>
    `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
    <Form onSubmit={onSubmit} >
        <Select label="Select" name="select">
          ${el.select
            .map(
              (el) => `<Option value="${el}" label="${el}" />
          `
            )
            .join("")}
        </Select>
    </Form>
    `);
    el.paramter.find((el) => el === "User") &&
    dat.push(`
    <Form onSubmit={onClick} >
      <UserPicker label="User" name="user"  />
    </Form>
`)
el.paramter.find((el) => el === "Date") &&
dat.push(`

<Form onSubmit={onDatePick} >
  <DatePicker name="date" label="Appointment Date" />
</Form>
`)

        spaceData = {
          data: dat.join(""),
          form:form.join(""),
        };
        var dataSpace = forgeTemplate(spaceData);
        zip.addFile(
          `src/${el.name.split(' ').join("-")}.jsx`,
          Buffer.from(dataSpace, "utf8"),
          "entry comment goes here"
        );
      
}

module.exports=forgeComponent