interface FeatureItemProps {
  feature: {
    name: string;
    description: string;
    icon: React.ElementType;
  };
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
  return (
    <div className="relative pl-9" key={feature.name}>
      <dt className="inline font-semibold text-gray-900">
        <feature.icon
          aria-hidden="true"
          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
        />
      </dt>
      <dd>{feature.description}</dd>
    </div>
  );
};

export default FeatureItem;
