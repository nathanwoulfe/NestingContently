#if NET472
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors.ValueConverters;
#else
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
#endif
namespace NestingContently.Umbraco.ValueConverters
{
	public class NestingContentlyValueConverter : YesNoValueConverter
	{
		public override bool IsConverter(IPublishedPropertyType propertyType) => propertyType.EditorAlias == "NestingContently";
	}
}
