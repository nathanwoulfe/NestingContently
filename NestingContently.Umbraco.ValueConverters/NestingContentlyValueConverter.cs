using Umbraco.Cms.Core.Models.PublishedContent;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestingContentlyValueConverter : global::Umbraco.Cms.Core.PropertyEditors.ValueConverters.YesNoValueConverter
	{
		public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == "NestingContently";
	}
}
