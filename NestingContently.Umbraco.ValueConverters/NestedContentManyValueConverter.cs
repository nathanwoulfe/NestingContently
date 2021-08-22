using System.Collections;
using System.Linq;
#if NET472
using Umbraco.Web.PropertyEditors.ValueConverters;
using Umbraco.Web.PublishedCache;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;
#else
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Extensions;
#endif

namespace NestingContently.Umbraco.ValueConverters
{
    public class NC_NestedContentManyValueConverter : NestedContentManyValueConverter
	{
		public NC_NestedContentManyValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory, IProfilingLogger proflog)
			: base(publishedSnapshotAccessor, publishedModelFactory, proflog)
		{ }

		public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
		{
			var list = (IList)base.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);
			if (list != null)
			{
				// Because the list can have different generic types, keep the current instance and only remove hidden elements
				var elements = list.Cast<IPublishedElement>().Where(e => !e.IsVisible()).ToArray();
				foreach (var element in elements)
				{
					list.Remove(element);
				}
			}

			return list;
		}
	}
}
