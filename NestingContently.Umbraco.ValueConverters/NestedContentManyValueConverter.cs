using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestedContentManyValueConverter : global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentManyValueConverter
	{
		public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
		{
			var list = (IEnumerable<IPublishedContent>)base.ConvertDataToSource(propertyType, source, preview);
			if (list != null)
			{
				return list.Where(nc => nc.IsVisible()).ToList();
			}

			return null;
		}
	}
}
