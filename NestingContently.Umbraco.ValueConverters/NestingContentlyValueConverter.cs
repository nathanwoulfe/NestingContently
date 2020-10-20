using Umbraco.Core.Models.PublishedContent;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestingContentlyValueConverter : global::Umbraco.Core.PropertyEditors.ValueConverters.YesNoValueConverter
	{
		public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == "NestingContently";
	}
}
