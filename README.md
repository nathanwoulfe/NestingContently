Depending on who you ask, a big gap in Umbraco's original Nested Content property editor was the ability to disable nested items (ie, keep them in the current editor, but turn 'em off on the front end). 

There are workarounds, but for our Dear Editors, the best solution is an additional button in the header row for each nested item (Archetype fans, I see you nodding).

While the days of Nested Content are largely behind us, the same issue exists in Block Grid and Block List.

The latest versions of Nesting Contently support ONLY Block-based editors on Umbraco 10+, adding a toggle to the block header so your editors will forever be ... wait for it ... Nesting Contently.

# Getting started

Installing and setting up the latest Nesting Contently version is straightforward:

- Install via your CLI of choice:
  - `dotnet add package NestingContently.Umbraco`
  - `Install-Package NestingContently.Umbraco`
- Add a true/false property to the block element (settings or content, either is fine)
- The property alias MUST be `umbracoNaviHide`
- Done. That's it. No more.
- Amaze your editors with the added flexibility

There's no longer a property editor to install, just some helpful Javascript to manage injecting the button and syncing the value change back to the block.

Nesting Contently v10+ ships with property value converters for Block List and Block Grid, to remove any hidden blocks before rendering.

For Block Grid, this works with infinitely nested blocks, so feel free to create disgusting levels of nesting (don't really, your editors will hate you).

There's no need to read any further, the rest is just a history lesson, but you can [jump straight to the good part](http://issues.umbraco.org/issue/U4-10422) and the [follow up good part](https://github.com/umbraco/Umbraco-CMS/issues/2887).

# What about the old Umbraco versions?

Nesting Contently originally supported Umbraco v7 (Nesting Contently v1), and only supported the Nested Content editor.

Support for v8+ (Nesting Contently v4+) came later.

v4 eventually supported Umbraco 8 and 9, with support for Nested Content and Block List.

Installing the wrong version won't blow up your site, it just won't do anything. That said, there's no plans to support anything other than the latest version. 

## Introducing Nesting Contently III - with a vengeance
Umbraco 8.7 introduced the Block List editor (can you believe it was that long ago?), which takes all the best bits of Nested Content, the Grid, Doc Type Grid Editor and others, mixes in a bit of unicorn snot to stick it all together and creates a new editing paradigm. Only thing missing? A native disable button for blocks.

Fear not! Nesting Contently III got your back, friend. NC III works its magic on the Block List, to make disabling blocks as easy as something really easy. NC III also supports nested Nested Content, if you're into that kinda thing. Probably supports nested nested Nested Content too, you pervert.

NC III is a big old change of approach with respect to updating model values - it's a lot simpler, to better work with (around?) Nested Content's interesting (odd?) approach to model syncing. For Block List, it's super straight forward, which is nice, and allows NC III to support both editors from the same implementation.

Hell, you shouldn't be reading this far. Don't install this version, go away and upgrade your Umbraco websites and enjoy all the features and improvements added since Block List arrived in 8.7 way back in September 2020.

### Get it
 - via Nuget => `Install-Package NestingContently.Umbraco`

### Setup

 - Install this package (derp)
 - Create a new data type using the Nesting Contently editor
 - Add the data type to the Nested Content document type
 - Name it whatever you like, but ideally set the alias to `umbracoNaviHide` to be able to use the `.IsVisible()` extension when iterating the nested items. Using any other alias means you'll need to check the property value when rendering
 - Stun your content editors with your brilliance
 
The editor itself is not displayed when editing the nested items - it only exists to create the property on the document type. 

The button is displayed in header rows for nested items containing the Nesting Contently editor, so we can have items with the disable/enable toggle, and others without, in the same Nested Content / Block List property. Cool, right?

Toggling the button modifies the parent's parent's parent's (maybe another parent) model value, and all is well. 

There's no need to touch any core files, so no worries with upgrade paths being borked. Some of the implementation is a little bit dirty, but this is essentially a hack anyway, so sue me (don't though).

### Extra setup bit if you don't want to install the property converters package (if not, why not?)

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

There may or may not be a similar thread debating the merits of a disable button in the Block List, but don't waste your time debating it, just install this bad boy and get on with your day.
