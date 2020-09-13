[![Build status](https://ci.appveyor.com/api/projects/status/5d665tl2a8x082be?svg=true)](https://ci.appveyor.com/project/nathanwoulfe/nestingcontently)
[![NuGet release](https://img.shields.io/nuget/dt/NestingContently.Umbraco.svg)](https://www.nuget.org/packages/NestingContently.Umbraco)

# NestingContently

Depending on who you ask, a big gap in Umbraco's Nested Content property editor is the ability to disable nested items (ie, keep them in the current editor, but turn 'em off on the front end). 

There are workarounds, but for our Dear Editors, the best solution is an additional button in the header row for each nested item (Archetype fans, I see you nodding).

This editor does exactly that - adds a disable/enable toggle to the Nested Content header so your editors will forever be ... wait for it ... Nesting Contently.

Supports Umbraco v7 (Nesting Contently v1) and v8 (Nesting Contently v2). Installing the wrong version won't blow up your site, it just won't work.

## Get it
 - via Nuget => `Install-Package NestingContently.Umbraco`
 - [zipped and ready to install](https://ci.appveyor.com/project/nathanwoulfe/nestingcontently/build/artifacts)

## Setup

 - Install this package (derp)
 - Create a new data type using the Nesting Contently editor
 - Add the data type to the Nested Content document type
 - Name it whatever you like, but ideally set the alias to `umbracoNaviHide` to be able to use the `.IsVisible()` extension when iterating the nested items. Using any other alias means you'll need to check the property value when rendering
 - Stun your content editors with your brilliance
 
The editor itself is not displayed when editing the nested items - it only exists to create the property on the document type. Instead, the response containing the Nested Content editor HTML is intercepted and modified to inject the new button as an AngularJs directive. 

The button is displayed in header rows for nested items containing the Nesting Contently editor, so we can have NC items with the disable/enable toggle, and others without, in the same Nested Content property. Cool, right?

Toggling the button modifies the parent's parent's parent's (maybe another parent) model value, and all is well. 

There's no need to touch any core files, so no worries with upgrade paths being borked. Some of the implementation is a little bit dirty, but this is essentially a hack anyway, so sue me.

### Extra setup bit

The above bits said, Models Builder doesn't play nice with Nesting Contently given the absence of a property value converter. Rather than adding an assembly to the package simply to deliver 8 lines of code, it's included below instead. 

Depending on your setup, this may not matter - using `umbracoNaviHide` and `.IsVisible()` will work fine without the converter - `.IsVisible()` explicitly uses Umbraco's built-in boolean converter, and is nicely declarative so makes your code more readable.

Add this somewhere to your solution to keep Models Builder happy (for v7, and v8, respectively):

```csharp
[PropertyValueType(typeof(bool))]
[PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Content)]
public class NestingContentlyValueConverter : Umbraco.Core.PropertyEditors.ValueConverters.YesNoValueConverter
{
    public override bool IsConverter(PublishedPropertyType propertyType)
    {
        return propertyType.PropertyEditorAlias == "NestingContently";
    }
}    
```

```csharp
using Umbraco.Core.Models.PublishedContent;

public class NestingContentlyValueConverter : Umbraco.Core.PropertyEditors.ValueConverters.YesNoValueConverter
{
   public override bool IsConverter(IPublishedPropertyType propertyType)
      => propertyType.EditorAlias == "NestingContently";
}
```

## Drama Cabana

It's a long read, but [this thread](http://issues.umbraco.org/issue/U4-10422) provides some background context around why this feature is (or isn't, depending on your persective) needed in the core.

It's also an interesting insight into product and community management, contributing to OSS and the investment plenty of people have in the Umbraco ecosystem.
