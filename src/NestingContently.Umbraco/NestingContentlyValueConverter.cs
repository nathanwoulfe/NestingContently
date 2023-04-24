using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;

namespace NestingContently.Umbraco.ValueConverters;

public class NestingContentlyValueConverter : YesNoValueConverter
{
    public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == "NestingContently";
}
