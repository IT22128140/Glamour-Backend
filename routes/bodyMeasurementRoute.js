import exprress, { request, response } from "express";
import { Measurement } from "../models/bodyMeasurementModel.js";

const router = exprress.Router();

// Calculate top sizes
const calculateTopSize = (gender, bust, waist, hip, neckBase, shoulderWidth) => {
  let size = 'Out of range';

  if (gender.toLowerCase() === 'female') {
    // For women
    if (bust >= 32 && bust <= 33 || waist >= 24 && waist <= 25 || hip >= 34.5 && hip <= 35.5) {
        size = 'XS';
    } else if (bust >= 34 && bust <= 35 || waist >= 26 && waist <= 27 || hip >= 36 && hip <= 37) {
        size = 'S';
    } else if (bust >= 36 && bust <= 37 || waist >= 28 && waist <= 29 || hip >= 38.5 && hip <= 39.5) {
        size = 'M';
    } else if (bust >= 38.5 && bust <= 40 || waist >= 30.5 && waist <= 32 || hip >= 41 && hip <= 42.5) {
        size = 'L';
    } else if (bust >= 41.5 && bust <= 43 || waist >= 33.5 && waist <= 35 || hip >= 44 && hip <= 45.5) {
        size = 'XL';
    }
} else if (gender.toLowerCase() === 'male') {
    // For men
    if (bust >= 34 && bust <= 36 || waist >= 28 && waist <= 30 || neckBase >= 14.37 && neckBase <= 15.16 || shoulderWidth >= 16.34 && shoulderWidth <= 16.93) {
        size = 'XS';
    } else if (bust >= 38 && bust <= 40 || waist >= 32 && waist <= 34 || neckBase >= 15.16 && neckBase <= 15.75 || shoulderWidth >= 16.93 && shoulderWidth <= 17.52) {
        size = 'S';
    } else if (bust >= 42 && bust <= 44 || waist >= 36 && waist <= 38 || neckBase >= 15.94 && neckBase <= 16.54 || shoulderWidth >= 17.52 && shoulderWidth <= 18.11) {
        size = 'M';
    } else if (bust >= 46 && bust <= 48 || waist >= 40 && waist <= 42 || neckBase >= 16.54 && neckBase <= 17.32 || shoulderWidth >= 18.11 && shoulderWidth <= 18.70) {
        size = 'L';
    } else if (bust >= 50 && bust <= 52 || waist >= 44 && waist <= 46 || neckBase >= 17.32 && neckBase <= 17.91 || shoulderWidth >= 18.70 && shoulderWidth <= 19.29) {
        size = 'XL';
    }
}
  return size;
};

// Calculate pant sizes
const calculatePantSize = (gender, waist, hip) => {
  let size = 'Out of range';

  if (gender.toLowerCase() === 'female') {
    // For women
    if (waist >= 24 && waist <= 25 || hip >= 34.5 && hip <= 35.5) {
        size = 'XS';
    } else if (waist >= 26 && waist <= 27 || hip >= 36.5 && hip <= 37.5) {
        size = 'S';
    } else if (waist >= 28 && waist <= 29 || hip >= 38.5 && hip <= 39.5) {
        size = 'M';
    } else if (waist >= 30 && waist <= 32 || hip >= 41 && hip <= 42.5) {
        size = 'L';
    } else if (waist >= 33.5 && waist <= 35 || hip >= 44 && hip <= 45.5) {
        size = 'XL';
    }
} else if (gender.toLowerCase() === 'male') {
    // For men
    if (waist >= 26 && waist <= 29 || hip >= 32 && hip <= 35) {
        size = 'XS';
    } else if (waist >= 29 && waist <= 32 || hip >= 35 && hip <= 38) {
        size = 'S';
    } else if (waist >= 32 && waist <= 35 || hip >= 38 && hip <= 41) {
        size = 'M';
    } else if (waist >= 35 && waist <= 38 || hip >= 41 && hip <= 44) {
        size = 'L';
    } else if (waist >= 38 && waist <= 41 || hip >= 44 && hip <= 47) {
        size = 'XL';
    }
}
  return size;
};


//Save new body measurement
router.post('/', async (request, response) => {
  try {
      const { MeasurementID, Gender, Bust, UnderBust, Waist, Hip, NeckBase, ShoulderWidth } = request.body;

      if (!MeasurementID || !Gender || !Bust || !UnderBust || !Waist || !Hip || !NeckBase || !ShoulderWidth) {
          return response.status(400).send({
              message: 'Send all required fields of the table',
          });
      }
      const topSize = calculateTopSize(Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth);
      const pantSize = calculatePantSize(Gender, Waist, Hip);

      const newMeasurement = {
          MeasurementID,
          Gender,
          Bust,
          UnderBust,
          Waist,
          Hip,
          NeckBase,
          ShoulderWidth,
          TopSize: topSize,
          PantSize: pantSize
      };

      const measurement = await Measurement.create(newMeasurement);
      return response.status(201).send(measurement);
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
  }
});

//Update a body measurement
router.put('/:id', async (request, response) => {
  try {
      const { Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth } = request.body;

      if (!Gender || !Bust || !Waist || !Hip || !NeckBase || !ShoulderWidth) {
          return response.status(400).send({
              message: 'Send all required fields:',
          });
      }
      const topSize = calculateTopSize(Gender, Bust, Waist, Hip, NeckBase, ShoulderWidth);
      const pantSize = calculatePantSize(Gender, Waist, Hip);

      const updateData = {
          ...request.body,
          TopSize: topSize,
          PantSize: pantSize
      };

      const result = await Measurement.findByIdAndUpdate(request.params.id, updateData);

      if (!result) {
          return response.status(404).json({ message: 'Measurement not found' });
      }

      return response.status(200).send({ message: 'Measurement updated successfully', updated: result });
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
  }
});

  //Route for Get All Machines from database
  router.get('/', async(request, response) => {
    try {
      const measurements = await Measurement.find({});
      
      return response.status(200).json({
        count: measurements.length,
        data: measurements
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({message: error.message});
    }
  });
  
  
  //Route for Get One Machine from database by id
  router.get('/:id', async(request, response) => {
    try {
      const { id } = request.params;
  
      const measurement = await Measurement.findById(id);
  
      return response.status(200).json(measurement);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({message: error.message});
    }
  });

//Route for delete a Measurement
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Measurement.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Measurement not found' });
    }

    return response.status(200).send({ message: 'Measurement deleted successfully' });

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;