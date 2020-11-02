using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace NestingContently.Umbraco.ValueConverters
{
	[PropertyValueType(typeof(bool))]
	[PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Content)]
	public class NestingContentlyValueConverter : global::Umbraco.Core.PropertyEditors.ValueConverters.YesNoValueConverter
	{
		public override bool IsConverter(PublishedPropertyType propertyType) => propertyType.PropertyEditorAlias == "NestingContently";
	}
}
