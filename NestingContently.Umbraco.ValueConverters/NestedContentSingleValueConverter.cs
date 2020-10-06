using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;
using Umbraco.Web.PublishedCache;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestedContentSingleValueConverter : global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentSingleValueConverter
	{
		public NestedContentSingleValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory, IProfilingLogger proflog)
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
