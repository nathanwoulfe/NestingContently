#if NET472
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;
using Umbraco.Web.PropertyEditors.ValueConverters;
using Umbraco.Web.PublishedCache;
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
	public class NC_NestedContentSingleValueConverter : NestedContentSingleValueConverter
	{
		public NC_NestedContentSingleValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory, IProfilingLogger proflog)
			: base(publishedSnapshotAccessor, publishedModelFactory, proflog)
		{ }

		public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
		{
			var element = (IPublishedElement)base.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);
			if (element != null && !element.IsVisible())
			{
				return null;
			}

			return element;
		}
	}
}
