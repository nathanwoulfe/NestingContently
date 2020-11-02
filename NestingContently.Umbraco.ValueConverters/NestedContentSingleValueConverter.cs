using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestedContentSingleValueConverter : global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentSingleValueConverter
	{
		public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
		{
			var content = (IPublishedContent)base.ConvertDataToSource(propertyType, source, preview);
			if (content != null && content.IsVisible())
			{
				return content;
			}

			return null;
		}
	}
}
