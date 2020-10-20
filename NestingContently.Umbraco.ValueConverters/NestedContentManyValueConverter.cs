using System.Collections;
using System.Linq;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;
using Umbraco.Web.PublishedCache;

namespace NestingContently.Umbraco.ValueConverters
{
	public class NestedContentManyValueConverter : global::Umbraco.Web.PropertyEditors.ValueConverters.NestedContentManyValueConverter
	{
		public NestedContentManyValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor, IPublishedModelFactory publishedModelFactory, IProfilingLogger proflog)
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
